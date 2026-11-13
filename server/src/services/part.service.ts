import { Types, FilterQuery } from "mongoose";
import { Part, IPart } from "../models/Part";
import { Category } from "../models/Category";
import { StockLog } from "../models/StockLog";
import { AppError } from "../utils/apiResponse";
import { slugify } from "../utils/slugify";
import { resolveMakeId, resolveModelId } from "./vehicle.service";
import { CreatePartInput, UpdatePartInput, RestockPartInput } from "../validators/part.schema";

export interface PartQueryParams {
  make?: string;
  model?: string;
  year?: string;
  category?: string;
  brand?: string;
  condition?: string;
  minPrice?: string;
  maxPrice?: string;
  search?: string;
  inStock?: string;
  page?: string;
  limit?: string;
  sort?: string;
  includeInactive?: string;
}

export interface PaginatedParts {
  parts: IPart[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  brands: string[];
}

export const getParts = async (query: PartQueryParams): Promise<PaginatedParts> => {
  const filter: FilterQuery<IPart> = {};

  if (query.includeInactive !== "true") {
    filter.isActive = true;
  }

  // Vehicle Compatibility Engine Filter
  if (query.make || query.model || query.year) {
    const elemMatch: Record<string, unknown> = {};

    if (query.make) {
      const makeId = await resolveMakeId(query.make);
      if (makeId) {
        elemMatch.make = makeId;
      } else {
        // Unknown make -> no vehicle-specific parts can match, only universal
        elemMatch.make = new Types.ObjectId();
      }
    }

    if (query.model) {
      const modelId = await resolveModelId(query.model, (elemMatch.make as Types.ObjectId) || null);
      if (modelId) {
        elemMatch.model = modelId;
      } else {
        elemMatch.model = new Types.ObjectId();
      }
    }

    if (query.year) {
      const yearNum = parseInt(query.year, 10);
      if (!Number.isNaN(yearNum)) {
        elemMatch.yearFrom = { $lte: yearNum };
        elemMatch.yearTo = { $gte: yearNum };
      }
    }

    filter.$or = [
      { isUniversal: true },
      { compatibility: { $elemMatch: elemMatch } },
    ];
  }

  // Category Filter (by ObjectId or slug)
  if (query.category) {
    if (Types.ObjectId.isValid(query.category)) {
      filter.category = new Types.ObjectId(query.category);
    } else {
      const cat = await Category.findOne({ slug: query.category.toLowerCase() });
      filter.category = cat ? cat._id : new Types.ObjectId();
    }
  }

  // Brand Filter
  if (query.brand) {
    filter.brand = { $regex: new RegExp(`^${query.brand.trim()}$`, "i") };
  }

  // Condition Filter
  if (query.condition && ["new", "used", "refurbished"].includes(query.condition)) {
    filter.condition = query.condition;
  }

  // In Stock Filter
  if (query.inStock === "true") {
    filter.stock = { $gt: 0 };
  }

  // Price Range Filter
  if (query.minPrice || query.maxPrice) {
    const priceQuery: Record<string, number> = {};
    if (query.minPrice && !Number.isNaN(Number(query.minPrice))) {
      priceQuery.$gte = Number(query.minPrice);
    }
    if (query.maxPrice && !Number.isNaN(Number(query.maxPrice))) {
      priceQuery.$lte = Number(query.maxPrice);
    }
    if (Object.keys(priceQuery).length > 0) {
      filter.price = priceQuery;
    }
  }

  // Search by name, partNumber, or brand
  if (query.search && query.search.trim()) {
    const term = query.search.trim();
    const searchRegex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const searchConditions = [
      { name: searchRegex },
      { partNumber: searchRegex },
      { brand: searchRegex },
    ];

    if (filter.$or) {
      filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
      delete filter.$or;
    } else {
      filter.$or = searchConditions;
    }
  }

  // Sorting
  let sortObj: Record<string, 1 | -1> = { createdAt: -1 };
  switch (query.sort) {
    case "price_asc":
      sortObj = { price: 1 };
      break;
    case "price_desc":
      sortObj = { price: -1 };
      break;
    case "name_asc":
      sortObj = { name: 1 };
      break;
    case "newest":
    default:
      sortObj = { createdAt: -1 };
      break;
  }

  const page = Math.max(1, parseInt(query.page || "1", 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit || "12", 10) || 12));
  const skip = (page - 1) * limit;

  const [parts, total, brands] = await Promise.all([
    Part.find(filter)
      .populate("category", "name slug")
      .populate("compatibility.make", "name slug")
      .populate("compatibility.model", "name slug")
      .sort(sortObj)
      .skip(skip)
      .limit(limit),
    Part.countDocuments(filter),
    Part.distinct("brand", { isActive: true }),
  ]);

  return {
    parts,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
    brands: (brands as string[]).sort(),
  };
};

export const getPartByIdOrSlug = async (
  idOrSlug: string
): Promise<{ part: IPart; relatedParts: IPart[] }> => {
  const query = Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug.toLowerCase() };

  const part = await Part.findOne(query)
    .populate("category", "name slug")
    .populate("compatibility.make", "name slug")
    .populate("compatibility.model", "name slug yearFrom yearTo")
    .populate({
      path: "relatedParts",
      populate: { path: "category", select: "name slug" },
    });

  if (!part) {
    throw new AppError("Spare part not found.", 404);
  }

  let relatedParts: IPart[] = [];
  if (part.relatedParts && part.relatedParts.length > 0) {
    relatedParts = (part.relatedParts as unknown as IPart[]).filter((p) => p && p.isActive);
  }

  if (relatedParts.length === 0) {
    relatedParts = await Part.find({
      _id: { $ne: part._id },
      category: part.category,
      isActive: true,
    })
      .populate("category", "name slug")
      .limit(4);
  }

  return { part, relatedParts };
};

export const createPart = async (
  data: CreatePartInput,
  uploadedImages: string[],
  userId?: string
): Promise<IPart> => {
  const existingSku = await Part.findOne({ partNumber: data.partNumber.toUpperCase() });
  if (existingSku) {
    throw new AppError("A part with this Part Number (OEM/SKU) already exists.", 409);
  }

  const catExists = await Category.findById(data.category);
  if (!catExists) {
    throw new AppError("Selected category does not exist.", 404);
  }

  const baseSlug = slugify(`${data.name}-${data.partNumber}`);
  const images = [...(data.existingImages || []), ...uploadedImages];

  const created = await Part.create({
    name: data.name,
    slug: baseSlug,
    partNumber: data.partNumber.toUpperCase(),
    brand: data.brand,
    category: data.category,
    description: data.description,
    price: data.price,
    discountPrice: data.discountPrice ?? null,
    images,
    stock: data.stock,
    lowStockThreshold: data.lowStockThreshold,
    condition: data.condition,
    warrantyMonths: data.warrantyMonths,
    isUniversal: data.isUniversal,
    compatibility: data.compatibility,
    relatedParts: (data.relatedParts || []).map((id) => new Types.ObjectId(id)),
    isActive: data.isActive,
  });

  if (created.stock > 0) {
    await StockLog.create({
      part: created._id,
      change: created.stock,
      newStock: created.stock,
      reason: "manual_restock",
      user: userId ? new Types.ObjectId(userId) : undefined,
      notes: "Initial stock upon part creation",
    });
  }

  return created.populate([
    { path: "category", select: "name slug" },
    { path: "compatibility.make", select: "name slug" },
    { path: "compatibility.model", select: "name slug" },
  ]);
};

export const updatePart = async (
  id: string,
  data: UpdatePartInput,
  uploadedImages: string[],
  userId?: string
): Promise<IPart> => {
  const part = await Part.findById(id);
  if (!part) {
    throw new AppError("Spare part not found.", 404);
  }

  const previousStock = part.stock;

  if (data.partNumber && data.partNumber.toUpperCase() !== part.partNumber) {
    const dup = await Part.findOne({
      partNumber: data.partNumber.toUpperCase(),
      _id: { $ne: part._id },
    });
    if (dup) {
      throw new AppError("Another part already uses this Part Number.", 409);
    }
    part.partNumber = data.partNumber.toUpperCase();
  }

  if (data.name !== undefined) {
    part.name = data.name;
    part.slug = slugify(`${data.name}-${part.partNumber}`);
  }
  if (data.brand !== undefined) part.brand = data.brand;
  if (data.category !== undefined) part.category = new Types.ObjectId(data.category);
  if (data.description !== undefined) part.description = data.description;
  if (data.price !== undefined) part.price = data.price;
  if (data.discountPrice !== undefined) part.discountPrice = data.discountPrice;
  if (data.stock !== undefined) part.stock = data.stock;
  if (data.lowStockThreshold !== undefined) part.lowStockThreshold = data.lowStockThreshold;
  if (data.condition !== undefined) part.condition = data.condition;
  if (data.warrantyMonths !== undefined) part.warrantyMonths = data.warrantyMonths;
  if (data.isUniversal !== undefined) part.isUniversal = data.isUniversal;
  if (data.isActive !== undefined) part.isActive = data.isActive;
  if (data.relatedParts !== undefined) {
    part.relatedParts = data.relatedParts.map((id) => new Types.ObjectId(id));
  }
  if (data.compatibility !== undefined) {
    part.compatibility = data.compatibility.map((c) => ({
      make: new Types.ObjectId(c.make),
      model: new Types.ObjectId(c.model),
      yearFrom: c.yearFrom,
      yearTo: c.yearTo,
    }));
  }

  if (data.existingImages !== undefined || uploadedImages.length > 0) {
    const kept = data.existingImages !== undefined ? data.existingImages : part.images;
    part.images = [...kept, ...uploadedImages];
  }

  await part.save();

  if (data.stock !== undefined && data.stock !== previousStock) {
    await StockLog.create({
      part: part._id,
      change: data.stock - previousStock,
      newStock: data.stock,
      reason: "adjustment",
      user: userId ? new Types.ObjectId(userId) : undefined,
      notes: "Stock updated via part edit",
    });
  }

  return part.populate([
    { path: "category", select: "name slug" },
    { path: "compatibility.make", select: "name slug" },
    { path: "compatibility.model", select: "name slug" },
  ]);
};

export const restockPart = async (
  id: string,
  input: RestockPartInput,
  userId?: string
): Promise<IPart> => {
  const part = await Part.findById(id);
  if (!part) {
    throw new AppError("Spare part not found.", 404);
  }

  const nextStock = part.stock + input.change;
  if (nextStock < 0) {
    throw new AppError(`Insufficient stock. Current stock is ${part.stock}.`, 400);
  }

  part.stock = nextStock;
  await part.save();

  await StockLog.create({
    part: part._id,
    change: input.change,
    newStock: nextStock,
    reason: input.reason,
    user: userId ? new Types.ObjectId(userId) : undefined,
    notes: input.notes || (input.change > 0 ? "Manual restock" : "Manual stock adjustment"),
  });

  return part;
};

export const deletePart = async (id: string): Promise<void> => {
  const part = await Part.findById(id);
  if (!part) {
    throw new AppError("Spare part not found.", 404);
  }
  part.isActive = false;
  await part.save();
};

