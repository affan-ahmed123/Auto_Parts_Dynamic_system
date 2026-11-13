import { Category, ICategory } from "../models/Category";
import { Part } from "../models/Part";
import { AppError } from "../utils/apiResponse";
import { slugify } from "../utils/slugify";
import { CreateCategoryInput } from "../validators/vehicle.schema";

export interface CategoryWithCount {
  _id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  isActive: boolean;
  partCount: number;
}

export const getAllCategories = async (): Promise<CategoryWithCount[]> => {
  const categories = await Category.find({ isActive: true }).sort({ name: 1 }).lean();
  const counts = await Part.aggregate<{ _id: string; count: number }>([
    { $match: { isActive: true } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  const countMap = new Map<string, number>();
  for (const row of counts) {
    if (row._id) {
      countMap.set(row._id.toString(), row.count);
    }
  }

  return categories.map((cat) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    description: cat.description || "",
    icon: cat.icon || "",
    isActive: cat.isActive,
    partCount: countMap.get(cat._id.toString()) || 0,
  }));
};

export const createCategory = async (data: CreateCategoryInput): Promise<ICategory> => {
  const slug = slugify(data.name);
  const existing = await Category.findOne({ $or: [{ name: data.name }, { slug }] });
  if (existing) {
    throw new AppError("Category already exists.", 409);
  }
  return Category.create({
    name: data.name,
    slug,
    description: data.description || "",
    icon: data.icon || "",
  });
};

export const updateCategory = async (
  id: string,
  data: Partial<CreateCategoryInput>
): Promise<ICategory> => {
  const category = await Category.findById(id);
  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  if (data.name) {
    category.name = data.name;
    category.slug = slugify(data.name);
  }
  if (data.description !== undefined) category.description = data.description;
  if (data.icon !== undefined) category.icon = data.icon;

  await category.save();
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  const partsInCat = await Part.countDocuments({ category: id });
  if (partsInCat > 0) {
    throw new AppError("Cannot delete a category that still has parts assigned.", 400);
  }
  const deleted = await Category.findByIdAndDelete(id);
  if (!deleted) {
    throw new AppError("Category not found.", 404);
  }
};

