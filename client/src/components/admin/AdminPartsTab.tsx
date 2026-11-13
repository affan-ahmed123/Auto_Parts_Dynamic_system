import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Trash2,
  Upload,
  X,
  Check,
  Edit3,
  ShoppingCart,
  Car,
  Image as ImageIcon,
  Search,
  Filter,
  Link2,
  RefreshCw,
} from "lucide-react";
import { getParts } from "../../services/part.service";
import { getMakes, getModels, getCategories } from "../../services/vehicle.service";
import { createPart, updatePart, deletePart, restockPart } from "../../services/admin.service";
import { PartItem, VehicleMake, VehicleModelItem, CategoryItem } from "../../types/catalog";
import { useToast } from "../../context/ToastContext";
import { useCart } from "../../context/CartContext";
import { resolveImageUrl, handleImageError } from "../../utils/image";

interface CompatRow {
  make: string;
  model: string;
  yearFrom: number;
  yearTo: number;
}

export const AdminPartsTab: React.FC = () => {
  const { showToast } = useToast();
  const { items: cartItems, addToCart, updateQuantity } = useCart();

  const [parts, setParts] = useState<PartItem[]>([]);
  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [allModels, setAllModels] = useState<VehicleModelItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Car Section / Filters State
  const [selectedMakeFilter, setSelectedMakeFilter] = useState("");
  const [selectedModelFilter, setSelectedModelFilter] = useState("");
  const [selectedYearFilter, setSelectedYearFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Add Part Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [partNumber, setPartNumber] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [discountPrice, setDiscountPrice] = useState("");
  const [stock, setStock] = useState("10");
  const [condition, setCondition] = useState<"new" | "used" | "refurbished">("new");
  const [warrantyMonths, setWarrantyMonths] = useState("12");
  const [isUniversal, setIsUniversal] = useState(false);
  const [compatRows, setCompatRows] = useState<CompatRow[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [customImageUrls, setCustomImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [selectedRelatedParts, setSelectedRelatedParts] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Edit Part Modal State
  const [editingPart, setEditingPart] = useState<PartItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editPartNumber, setEditPartNumber] = useState("");
  const [editBrand, setEditBrand] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDiscountPrice, setEditDiscountPrice] = useState("");
  const [editStock, setEditStock] = useState("10");
  const [editCondition, setEditCondition] = useState<"new" | "used" | "refurbished">("new");
  const [editWarrantyMonths, setEditWarrantyMonths] = useState("12");
  const [editIsUniversal, setEditIsUniversal] = useState(false);
  const [editCompatRows, setEditCompatRows] = useState<CompatRow[]>([]);
  const [editExistingImages, setEditExistingImages] = useState<string[]>([]);
  const [editNewImageFiles, setEditNewImageFiles] = useState<File[]>([]);
  const [editNewPreviews, setEditNewPreviews] = useState<string[]>([]);
  const [editImageUrlInput, setEditImageUrlInput] = useState("");
  const [editRelatedParts, setEditRelatedParts] = useState<string[]>([]);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Load All Parts & Vehicle Data
  const loadAll = async () => {
    setLoading(true);
    try {
      const [partsRes, makesRes, modelsRes, catsRes] = await Promise.all([
        getParts({ limit: 100, includeInactive: "true" }),
        getMakes(),
        getModels(),
        getCategories(),
      ]);
      setParts(partsRes.parts);
      setMakes(makesRes);
      setAllModels(modelsRes);
      setCategories(catsRes);
      if (!category && catsRes.length > 0) setCategory(catsRes[0]._id);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to load parts", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadAll();
  }, []);

  // Live File Previews for Add Form
  useEffect(() => {
    if (imageFiles.length === 0) {
      setImagePreviews([]);
      return;
    }
    const urls = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [imageFiles]);

  // Live File Previews for Edit Modal
  useEffect(() => {
    if (editNewImageFiles.length === 0) {
      setEditNewPreviews([]);
      return;
    }
    const urls = editNewImageFiles.map((file) => URL.createObjectURL(file));
    setEditNewPreviews(urls);
    return () => {
      urls.forEach((u) => URL.revokeObjectURL(u));
    };
  }, [editNewImageFiles]);

  // Filtered models for Individual Car Section dropdowns
  const availableFilterModels = useMemo(() => {
    if (!selectedMakeFilter) return [];
    return allModels.filter((m) =>
      typeof m.make === "object"
        ? m.make._id === selectedMakeFilter
        : m.make === selectedMakeFilter
    );
  }, [allModels, selectedMakeFilter]);

  // Filter parts based on search, selected car make/model/year
  const filteredParts = useMemo(() => {
    return parts.filter((p) => {
      // Search query check
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchSku = p.partNumber.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        if (!matchName && !matchSku && !matchBrand) return false;
      }

      // Individual car filter check
      if (selectedMakeFilter) {
        if (p.isUniversal) return true;
        const matchesCar = p.compatibility.some((c) => {
          const makeId = typeof c.make === "object" ? c.make?._id : c.make;
          if (makeId !== selectedMakeFilter) return false;

          if (selectedModelFilter) {
            const modelId = typeof c.model === "object" ? c.model?._id : c.model;
            if (modelId !== selectedModelFilter) return false;
          }

          if (selectedYearFilter) {
            const yr = parseInt(selectedYearFilter, 10);
            if (!Number.isNaN(yr) && (yr < c.yearFrom || yr > c.yearTo)) return false;
          }

          return true;
        });

        if (!matchesCar) return false;
      }

      return true;
    });
  }, [parts, searchQuery, selectedMakeFilter, selectedModelFilter, selectedYearFilter]);

  // Trigger "Add Part for this Car" with pre-populated compatibility row
  const handleOpenAddForCar = () => {
    const makeObj = makes.find((m) => m._id === selectedMakeFilter);
    const modelObj = availableFilterModels.find((m) => m._id === selectedModelFilter) || availableFilterModels[0];

    const initialCompat: CompatRow[] = [];
    if (selectedMakeFilter && modelObj) {
      initialCompat.push({
        make: selectedMakeFilter,
        model: modelObj._id,
        yearFrom: selectedYearFilter ? parseInt(selectedYearFilter, 10) : modelObj.yearFrom,
        yearTo: selectedYearFilter ? parseInt(selectedYearFilter, 10) : modelObj.yearTo,
      });
    }

    setCompatRows(initialCompat);
    setIsUniversal(false);
    setShowAddForm(true);
    showToast(
      makeObj
        ? `Fitment pre-filled for ${makeObj.name} ${modelObj?.name || ""}`
        : "Add new part form ready"
    );
  };

  // Add & update compatibility rows in Add Form
  const addCompatRow = () => {
    const defaultMake = selectedMakeFilter || makes[0]?._id || "";
    const matchingModel = allModels.find((m) =>
      typeof m.make === "object" ? m.make._id === defaultMake : m.make === defaultMake
    );
    setCompatRows([
      ...compatRows,
      {
        make: defaultMake,
        model: matchingModel?._id || "",
        yearFrom: matchingModel?.yearFrom || 2015,
        yearTo: matchingModel?.yearTo || 2025,
      },
    ]);
  };

  const updateCompatRow = (index: number, field: keyof CompatRow, value: string | number) => {
    const updated = [...compatRows];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "make") {
      const firstModel = allModels.find((m) =>
        typeof m.make === "object" ? m.make._id === value : m.make === value
      );
      updated[index].model = firstModel?._id || "";
      if (firstModel) {
        updated[index].yearFrom = firstModel.yearFrom;
        updated[index].yearTo = firstModel.yearTo;
      }
    }
    setCompatRows(updated);
  };

  const removeCompatRow = (index: number) => {
    setCompatRows(compatRows.filter((_, i) => i !== index));
  };

  // Compatibility Row Helpers for Edit Modal
  const addEditCompatRow = () => {
    const defaultMake = makes[0]?._id || "";
    const matchingModel = allModels.find((m) =>
      typeof m.make === "object" ? m.make._id === defaultMake : m.make === defaultMake
    );
    setEditCompatRows([
      ...editCompatRows,
      {
        make: defaultMake,
        model: matchingModel?._id || "",
        yearFrom: matchingModel?.yearFrom || 2015,
        yearTo: matchingModel?.yearTo || 2025,
      },
    ]);
  };

  const updateEditCompatRow = (index: number, field: keyof CompatRow, value: string | number) => {
    const updated = [...editCompatRows];
    updated[index] = { ...updated[index], [field]: value };

    if (field === "make") {
      const firstModel = allModels.find((m) =>
        typeof m.make === "object" ? m.make._id === value : m.make === value
      );
      updated[index].model = firstModel?._id || "";
      if (firstModel) {
        updated[index].yearFrom = firstModel.yearFrom;
        updated[index].yearTo = firstModel.yearTo;
      }
    }
    setEditCompatRows(updated);
  };

  const removeEditCompatRow = (index: number) => {
    setEditCompatRows(editCompatRows.filter((_, i) => i !== index));
  };

  // Add Direct Image URL / Cloudinary URL in Add Form
  const handleAddCustomImageUrl = () => {
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;
    if (customImageUrls.includes(trimmed)) {
      showToast("This image URL is already in the list", "error");
      return;
    }
    setCustomImageUrls([...customImageUrls, trimmed]);
    setImageUrlInput("");
  };

  // Add Direct Image URL / Cloudinary URL in Edit Modal
  const handleAddEditImageUrl = () => {
    const trimmed = editImageUrlInput.trim();
    if (!trimmed) return;
    if (editExistingImages.includes(trimmed)) {
      showToast("This image URL is already in the list", "error");
      return;
    }
    setEditExistingImages([...editExistingImages, trimmed]);
    setEditImageUrlInput("");
  };

  // Create Part Submission
  const handleCreatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("partNumber", partNumber);
      formData.append("brand", brand);
      formData.append("category", category);
      formData.append("description", description);
      formData.append("price", price);
      if (discountPrice) formData.append("discountPrice", discountPrice);
      formData.append("stock", stock);
      formData.append("condition", condition);
      formData.append("warrantyMonths", warrantyMonths);
      formData.append("isUniversal", String(isUniversal));
      formData.append(
        "compatibility",
        JSON.stringify(isUniversal ? [] : compatRows.filter((c) => c.make && c.model))
      );
      formData.append("relatedParts", JSON.stringify(selectedRelatedParts));

      if (customImageUrls.length > 0) {
        formData.append("existingImages", JSON.stringify(customImageUrls));
      }

      for (const file of imageFiles) {
        formData.append("images", file);
      }

      await createPart(formData);
      showToast("Part created successfully with images!");
      setShowAddForm(false);
      setName("");
      setPartNumber("");
      setBrand("");
      setDescription("");
      setPrice("");
      setDiscountPrice("");
      setCompatRows([]);
      setImageFiles([]);
      setCustomImageUrls([]);
      setSelectedRelatedParts([]);
      void loadAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to create part", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Edit Modal for an Existing Part
  const handleStartEdit = (p: PartItem) => {
    setEditingPart(p);
    setEditName(p.name);
    setEditPartNumber(p.partNumber);
    setEditBrand(p.brand);
    setEditCategory(typeof p.category === "object" ? p.category._id : p.category);
    setEditDescription(p.description);
    setEditPrice(String(p.price));
    setEditDiscountPrice(p.discountPrice ? String(p.discountPrice) : "");
    setEditStock(String(p.stock));
    setEditCondition(p.condition);
    setEditWarrantyMonths(String(p.warrantyMonths));
    setEditIsUniversal(Boolean(p.isUniversal));

    // Map existing compatibility
    const mappedCompat = (p.compatibility || []).map((c) => ({
      make: typeof c.make === "object" ? c.make?._id : c.make,
      model: typeof c.model === "object" ? c.model?._id : c.model,
      yearFrom: c.yearFrom,
      yearTo: c.yearTo,
    }));
    setEditCompatRows(mappedCompat);

    // Existing images & related parts
    setEditExistingImages(p.images || []);
    setEditNewImageFiles([]);
    setEditNewPreviews([]);
    setEditImageUrlInput("");

    const relatedIds = (p.relatedParts || []).map((r) =>
      typeof r === "object" ? r._id : r
    );
    setEditRelatedParts(relatedIds);
  };

  // Update Part Submission
  const handleUpdatePart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPart) return;
    setEditSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("name", editName);
      formData.append("partNumber", editPartNumber);
      formData.append("brand", editBrand);
      formData.append("category", editCategory);
      formData.append("description", editDescription);
      formData.append("price", editPrice);
      if (editDiscountPrice) {
        formData.append("discountPrice", editDiscountPrice);
      } else {
        formData.append("discountPrice", "");
      }
      formData.append("stock", editStock);
      formData.append("condition", editCondition);
      formData.append("warrantyMonths", editWarrantyMonths);
      formData.append("isUniversal", String(editIsUniversal));
      formData.append(
        "compatibility",
        JSON.stringify(editIsUniversal ? [] : editCompatRows.filter((c) => c.make && c.model))
      );
      formData.append("existingImages", JSON.stringify(editExistingImages));
      formData.append("relatedParts", JSON.stringify(editRelatedParts));

      for (const file of editNewImageFiles) {
        formData.append("images", file);
      }

      await updatePart(editingPart._id, formData);
      showToast(`Part "${editName}" updated successfully!`);
      setEditingPart(null);
      void loadAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update part", "error");
    } finally {
      setEditSubmitting(false);
    }
  };

  // Delete/Deactivate Part
  const handleDelete = async (id: string, partName: string) => {
    if (!window.confirm(`Deactivate "${partName}"?`)) return;
    try {
      await deletePart(id);
      showToast("Part deactivated");
      void loadAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to delete part", "error");
    }
  };

  // Quick Restock prompt
  const handleQuickRestock = async (id: string) => {
    const qtyStr = window.prompt("Enter quantity to add to inventory:", "10");
    if (!qtyStr) return;
    const qty = parseInt(qtyStr, 10);
    if (Number.isNaN(qty) || qty === 0) return;

    try {
      await restockPart(id, qty, "Quick adjustment from admin inventory table");
      showToast("Stock updated");
      void loadAll();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to adjust stock", "error");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <span>Parts Inventory &amp; Fitment</span>
            <span className="text-xs bg-red-50 text-red-700 font-bold px-2.5 py-0.5 rounded-full border border-red-200">
              {filteredParts.length} of {parts.length} parts
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage individual car fitments, upload Cloudinary / local pictures, and control stock
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setShowAddForm(!showAddForm);
              if (!showAddForm && compatRows.length === 0) {
                addCompatRow();
              }
            }}
            className="px-4 py-2.5 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md hover:shadow-red-500/25 transition-all cursor-pointer"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showAddForm ? "Close Form" : "Add New Part"}
          </button>
        </div>
      </div>

      {/* INDIVIDUAL CAR SECTION / FILTER CARD */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 shadow-xl shadow-slate-900/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Car className="w-4 h-4 text-red-600" />
            <span>Individual Car Section &amp; Quick Compatibility Filter</span>
          </div>
          {(selectedMakeFilter || selectedModelFilter || selectedYearFilter || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMakeFilter("");
                setSelectedModelFilter("");
                setSelectedYearFilter("");
                setSearchQuery("");
              }}
              className="text-xs text-red-600 hover:underline flex items-center gap-1 font-medium self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" /> Clear All Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Make Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              1. Select Make
            </label>
            <select
              value={selectedMakeFilter}
              onChange={(e) => {
                setSelectedMakeFilter(e.target.value);
                setSelectedModelFilter("");
              }}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">All Makes (All Cars)</option>
              {makes.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              2. Select Model
            </label>
            <select
              disabled={!selectedMakeFilter}
              value={selectedModelFilter}
              onChange={(e) => setSelectedModelFilter(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 disabled:bg-slate-50 disabled:text-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            >
              <option value="">
                {selectedMakeFilter ? "All Models of this Make" : "Select a Make first"}
              </option>
              {availableFilterModels.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.yearFrom}-{m.yearTo})
                </option>
              ))}
            </select>
          </div>

          {/* Year Selector */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              3. Year (Optional)
            </label>
            <input
              type="number"
              placeholder="e.g. 2020"
              value={selectedYearFilter}
              onChange={(e) => setSelectedYearFilter(e.target.value)}
              className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
            />
          </div>

          {/* Search Part Name/SKU */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
              Search by Name / SKU
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search part name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg pl-8 pr-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        </div>

        {/* Selected Car Highlight & "Add Part for this Car" Action */}
        {selectedMakeFilter && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-red-50/60 border border-red-200/80 rounded-xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
              <p className="text-xs text-slate-800">
                Active Vehicle Focus:{" "}
                <strong className="text-red-700 font-bold">
                  {makes.find((m) => m._id === selectedMakeFilter)?.name}{" "}
                  {availableFilterModels.find((m) => m._id === selectedModelFilter)?.name || ""}{" "}
                  {selectedYearFilter ? `(${selectedYearFilter})` : ""}
                </strong>
                <span className="text-slate-500 ml-1">
                  &bull; Showing {filteredParts.length} parts matched
                </span>
              </p>
            </div>

            <button
              onClick={handleOpenAddForCar}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Part for this Car
            </button>
          </div>
        )}
      </div>

      {/* ADD NEW PART FORM */}
      {showAddForm && (
        <form
          onSubmit={handleCreatePart}
          className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-6 sm:p-7 space-y-6 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">Add New Spare Part</h3>
              <p className="text-xs text-slate-500">
                Create a new catalog item with images, vehicle fitments, and related products
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="p-1 text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Part Name *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Ceramic Front Brake Pads"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                OEM / SKU Number *
              </label>
              <input
                type="text"
                required
                value={partNumber}
                onChange={(e) => setPartNumber(e.target.value)}
                placeholder="e.g. BRK-TOY-04465"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 uppercase font-mono focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Brembo / Denso / Bosch"
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white focus:ring-1 focus:ring-slate-900"
              >
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Sale Price ($) (Optional)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={discountPrice}
                onChange={(e) => setDiscountPrice(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock *</label>
              <input
                type="number"
                min="0"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Condition</label>
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value as "new" | "used" | "refurbished")}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
              >
                <option value="new">New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Used</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Warranty (Months)</label>
              <input
                type="number"
                min="0"
                value={warrantyMonths}
                onChange={(e) => setWarrantyMonths(e.target.value)}
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
              <textarea
                rows={2}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide clear specifications, fitment notes, and OEM standards..."
                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          {/* IMAGE MANAGEMENT (File Upload + Cloudinary / Direct URLs + Instant Render) */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <ImageIcon className="w-4 h-4 text-slate-600" />
              <span>Product Pictures &amp; Cloudinary Upload</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* File upload input */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Upload Picture Files (JPG, PNG, WebP)
                </label>
                <label className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:bg-slate-50 transition text-center">
                  <Upload className="w-6 h-6 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-700">
                    {imageFiles.length > 0
                      ? `${imageFiles.length} file(s) selected`
                      : "Choose photos from your computer"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Mirrored locally and uploaded to Cloudinary
                  </span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setImageFiles([...imageFiles, ...files]);
                    }}
                  />
                </label>
              </div>

              {/* Direct image URL or Cloudinary URL */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Or Paste Direct Image / Cloudinary URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://res.cloudinary.com/... or /uploads/..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomImageUrl}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg flex items-center gap-1"
                  >
                    <Link2 className="w-3.5 h-3.5" /> Add URL
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 mt-1">
                  Works seamlessly with Cloudinary secure URLs or existing hosted paths.
                </p>
              </div>
            </div>

            {/* Live Browser Image Render Previews */}
            {(imagePreviews.length > 0 || customImageUrls.length > 0) && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-slate-700 mb-2">
                  Image Previews (Instant Browser Render):
                </p>
                <div className="flex flex-wrap gap-3">
                  {imagePreviews.map((url, idx) => (
                    <div
                      key={`preview-${idx}`}
                      className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group"
                    >
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedFiles = imageFiles.filter((_, i) => i !== idx);
                          setImageFiles(updatedFiles);
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-slate-900/70 text-white text-[9px] text-center">
                        Local File
                      </span>
                    </div>
                  ))}

                  {customImageUrls.map((url, idx) => (
                    <div
                      key={`url-${idx}`}
                      className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group"
                    >
                      <img
                        src={resolveImageUrl(url)}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => handleImageError(e)}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setCustomImageUrls(customImageUrls.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                        title="Remove"
                      >
                        <X className="w-3 h-3" />
                      </button>
                      <span className="absolute bottom-0 left-0 right-0 bg-emerald-700/80 text-white text-[9px] text-center">
                        Web URL
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RELATED PARTS SELECTOR */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <span>Related Parts (Recommended Accessories &amp; Cross-Sells)</span>
            </h4>

            <div>
              <select
                onChange={(e) => {
                  const val = e.target.value;
                  if (val && !selectedRelatedParts.includes(val)) {
                    setSelectedRelatedParts([...selectedRelatedParts, val]);
                  }
                  e.target.value = "";
                }}
                className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                defaultValue=""
              >
                <option value="" disabled>
                  -- Select a related spare part to recommend with this item --
                </option>
                {parts.map((p) => (
                  <option key={p._id} value={p._id}>
                    [{p.partNumber}] {p.name} (${p.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>

            {selectedRelatedParts.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {selectedRelatedParts.map((relId) => {
                  const matchedPart = parts.find((p) => p._id === relId);
                  return (
                    <span
                      key={relId}
                      className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                    >
                      <span className="font-semibold">{matchedPart?.name || relId}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedRelatedParts(selectedRelatedParts.filter((id) => id !== relId))
                        }
                        className="text-slate-400 hover:text-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* VEHICLE FITMENT / COMPATIBILITY ROWS */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isUniversal}
                  onChange={(e) => setIsUniversal(e.target.checked)}
                  className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                />
                <span>Universal Fit (Fits all vehicles regardless of make/model)</span>
              </label>

              {!isUniversal && (
                <button
                  type="button"
                  onClick={addCompatRow}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Car Fitment Row
                </button>
              )}
            </div>

            {!isUniversal && (
              <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                {compatRows.length === 0 ? (
                  <p className="text-xs text-slate-500 italic text-center py-2">
                    No specific vehicles added yet. Click &quot;Add Car Fitment Row&quot; above to specify compatibility.
                  </p>
                ) : (
                  compatRows.map((row, idx) => {
                    const rowModels = allModels.filter((m) =>
                      typeof m.make === "object" ? m.make._id === row.make : m.make === row.make
                    );
                    return (
                      <div
                        key={idx}
                        className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200"
                      >
                        <select
                          value={row.make}
                          onChange={(e) => updateCompatRow(idx, "make", e.target.value)}
                          className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white font-medium"
                        >
                          {makes.map((mk) => (
                            <option key={mk._id} value={mk._id}>
                              {mk.name}
                            </option>
                          ))}
                        </select>

                        <select
                          value={row.model}
                          onChange={(e) => updateCompatRow(idx, "model", e.target.value)}
                          className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white font-medium"
                        >
                          {rowModels.map((md) => (
                            <option key={md._id} value={md._id}>
                              {md.name}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">From:</span>
                          <input
                            type="number"
                            value={row.yearFrom}
                            onChange={(e) =>
                              updateCompatRow(idx, "yearFrom", parseInt(e.target.value, 10) || 2000)
                            }
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white w-full"
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-400">To:</span>
                          <input
                            type="number"
                            value={row.yearTo}
                            onChange={(e) =>
                              updateCompatRow(idx, "yearTo", parseInt(e.target.value, 10) || 2025)
                            }
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white w-full"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeCompatRow(idx)}
                          className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center justify-center p-1.5"
                        >
                          Remove
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              {submitting ? "Saving Part..." : "Save Part to Catalog"}
            </button>
          </div>
        </form>
      )}

      {/* PARTS TABLE WITH CART TAG AND PICTURE PREVIEW */}
      <div className="bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-500" />
            <h3 className="text-sm font-bold text-slate-900">
              Spare Parts Catalog ({filteredParts.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click SKU or Edit to update images &amp; compatibility
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">
            <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-slate-400" />
            Loading catalog parts...
          </div>
        ) : filteredParts.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 space-y-2">
            <p className="font-semibold text-slate-700">No parts matched your criteria.</p>
            <p>Try clearing your make/model filter or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4 font-bold">Product &amp; Picture</th>
                  <th className="py-3.5 px-4 font-bold">OEM / SKU / Brand</th>
                  <th className="py-3.5 px-4 font-bold">Category</th>
                  <th className="py-3.5 px-4 font-bold">Price</th>
                  <th className="py-3.5 px-4 font-bold">Stock</th>
                  <th className="py-3.5 px-4 font-bold">Cart Tag</th>
                  <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredParts.map((p) => {
                  const cartItem = cartItems.find((ci) => ci.part._id === p._id);
                  const categoryName =
                    typeof p.category === "object" && p.category !== null
                      ? p.category.name
                      : undefined;
                  const imageSrc = resolveImageUrl(p.images?.[0], categoryName);

                  return (
                    <tr
                      key={p._id}
                      className={`hover:bg-slate-50/60 transition ${!p.isActive ? "opacity-50" : ""
                        }`}
                    >
                      {/* Product Name & Picture */}
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg border border-slate-200 bg-white p-1 shrink-0 flex items-center justify-center overflow-hidden shadow-xs">
                            <img
                              src={imageSrc}
                              alt=""
                              className="w-full h-full object-contain"
                              onError={(e) => handleImageError(e, categoryName)}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block leading-tight">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize mt-0.5 block">
                              {p.condition} &bull; {p.warrantyMonths}m warranty
                              {p.isUniversal && (
                                <span className="ml-1 text-blue-600 font-semibold">
                                  &bull; Universal
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* OEM / Brand */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                          {p.partNumber}
                        </span>
                        <span className="block text-[11px] text-slate-500 mt-0.5">{p.brand}</span>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 text-slate-600 font-medium">
                        {p.category?.name || "-"}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        ${(p.discountPrice ?? p.price).toFixed(2)}
                        {p.discountPrice && (
                          <span className="block text-[10px] text-slate-400 line-through">
                            ${p.price.toFixed(2)}
                          </span>
                        )}
                      </td>

                      {/* Stock with adjustment */}
                      <td className="py-3.5 px-4">
                        <button
                          type="button"
                          onClick={() => handleQuickRestock(p._id)}
                          className={`font-semibold px-2 py-0.5 rounded-full border text-[11px] ${p.stock <= p.lowStockThreshold
                            ? "bg-red-50 text-red-700 border-red-200"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200"
                            }`}
                          title="Click to adjust stock"
                        >
                          {p.stock} in stock
                        </button>
                      </td>

                      {/* CART TAG (In Cart Status & Controls) */}
                      <td className="py-3.5 px-4">
                        {cartItem ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-full font-bold text-[11px] shadow-xs">
                            <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                            <span>In Cart ({cartItem.quantity})</span>
                            <button
                              type="button"
                              onClick={() => void updateQuantity(p._id, cartItem.quantity + 1)}
                              className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-[10px]"
                              title="Add 1 more"
                            >
                              +
                            </button>
                            <button
                              type="button"
                              onClick={() => void updateQuantity(p._id, cartItem.quantity - 1)}
                              className="w-4 h-4 rounded-full bg-emerald-200 hover:bg-emerald-300 text-emerald-900 flex items-center justify-center font-bold text-[10px]"
                              title="Decrease 1"
                            >
                              -
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              void addToCart({
                                _id: p._id,
                                name: p.name,
                                slug: p.slug,
                                partNumber: p.partNumber,
                                brand: p.brand,
                                price: p.price,
                                discountPrice: p.discountPrice,
                                images: p.images,
                                stock: p.stock,
                                isActive: p.isActive,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-full text-[11px] font-medium transition"
                            title="Add to cart tag"
                          >
                            <ShoppingCart className="w-3 h-3 text-slate-500" />
                            <span>+ Cart Tag</span>
                          </button>
                        )}
                      </td>

                      {/* Actions: Edit & Deactivate */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                            title="Edit part details, pictures & fitment"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>

                          {p.isActive && (
                            <button
                              type="button"
                              onClick={() => handleDelete(p._id, p.name)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                              title="Deactivate part"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* EDIT PART MODAL */}
      {editingPart && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-3xl w-full p-6 sm:p-7 shadow-2xl my-8 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-blue-600" />
                  Edit Spare Part: {editingPart.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Update images, Cloudinary links, pricing, vehicle fitments, and related parts
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPart(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdatePart} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Part Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    OEM / SKU *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPartNumber}
                    onChange={(e) => setEditPartNumber(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 uppercase font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={editBrand}
                    onChange={(e) => setEditBrand(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category *
                  </label>
                  <select
                    required
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Sale Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editDiscountPrice}
                    onChange={(e) => setEditDiscountPrice(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Stock Units *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Condition
                  </label>
                  <select
                    value={editCondition}
                    onChange={(e) =>
                      setEditCondition(e.target.value as "new" | "used" | "refurbished")
                    }
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="new">New</option>
                    <option value="refurbished">Refurbished</option>
                    <option value="used">Used</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Warranty (Months)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={editWarrantyMonths}
                    onChange={(e) => setEditWarrantyMonths(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>

              {/* IMAGE MANAGEMENT IN EDIT MODAL */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-slate-600" />
                  <span>Update Product Pictures (Cloudinary &amp; Uploads)</span>
                </h4>

                {/* Existing Images */}
                {editExistingImages.length > 0 && (
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
                      Current Pictures (click X to remove):
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {editExistingImages.map((imgUrl, idx) => (
                        <div
                          key={`existing-${idx}`}
                          className="relative w-20 h-20 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 group"
                        >
                          <img
                            src={resolveImageUrl(imgUrl)}
                            alt=""
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e)}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setEditExistingImages(
                                editExistingImages.filter((_, i) => i !== idx)
                              );
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full opacity-90 hover:opacity-100"
                            title="Remove picture"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add More Files or Cloudinary URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Upload Additional Images
                    </label>
                    <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50 text-xs text-slate-600">
                      <Upload className="w-4 h-4 text-slate-400" />
                      <span>
                        {editNewImageFiles.length > 0
                          ? `${editNewImageFiles.length} file(s) selected`
                          : "Choose JPG / PNG product photos"}
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          setEditNewImageFiles([...editNewImageFiles, ...files]);
                        }}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Add Cloudinary / Web Picture URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://res.cloudinary.com/..."
                        value={editImageUrlInput}
                        onChange={(e) => setEditImageUrlInput(e.target.value)}
                        className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2"
                      />
                      <button
                        type="button"
                        onClick={handleAddEditImageUrl}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>

                {/* New Image Previews */}
                {editNewPreviews.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[11px] font-semibold text-slate-600 mb-1">
                      Staged New Uploads:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {editNewPreviews.map((url, idx) => (
                        <div
                          key={`new-${idx}`}
                          className="relative w-16 h-16 rounded border border-slate-200 overflow-hidden bg-slate-50"
                        >
                          <img src={url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              setEditNewImageFiles(editNewImageFiles.filter((_, i) => i !== idx));
                            }}
                            className="absolute top-1 right-1 p-0.5 bg-red-600 text-white rounded-full"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RELATED PARTS IN EDIT MODAL */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Related Parts
                </h4>
                <select
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val && !editRelatedParts.includes(val)) {
                      setEditRelatedParts([...editRelatedParts, val]);
                    }
                    e.target.value = "";
                  }}
                  className="w-full text-xs border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  defaultValue=""
                >
                  <option value="" disabled>
                    -- Add a related part --
                  </option>
                  {parts
                    .filter((p) => p._id !== editingPart._id)
                    .map((p) => (
                      <option key={p._id} value={p._id}>
                        [{p.partNumber}] {p.name}
                      </option>
                    ))}
                </select>

                {editRelatedParts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {editRelatedParts.map((relId) => {
                      const matched = parts.find((p) => p._id === relId);
                      return (
                        <span
                          key={relId}
                          className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg border border-slate-200"
                        >
                          <span>{matched?.name || relId}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setEditRelatedParts(editRelatedParts.filter((id) => id !== relId))
                            }
                            className="text-slate-400 hover:text-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* VEHICLE FITMENT ROWS IN EDIT MODAL */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editIsUniversal}
                      onChange={(e) => setEditIsUniversal(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900"
                    />
                    <span>Universal Fit</span>
                  </label>

                  {!editIsUniversal && (
                    <button
                      type="button"
                      onClick={addEditCompatRow}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Car Fitment Row
                    </button>
                  )}
                </div>

                {!editIsUniversal && (
                  <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {editCompatRows.map((row, idx) => {
                      const rowModels = allModels.filter((m) =>
                        typeof m.make === "object" ? m.make._id === row.make : m.make === row.make
                      );
                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center bg-white p-2 rounded-lg border border-slate-200"
                        >
                          <select
                            value={row.make}
                            onChange={(e) => updateEditCompatRow(idx, "make", e.target.value)}
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white font-medium"
                          >
                            {makes.map((mk) => (
                              <option key={mk._id} value={mk._id}>
                                {mk.name}
                              </option>
                            ))}
                          </select>

                          <select
                            value={row.model}
                            onChange={(e) => updateEditCompatRow(idx, "model", e.target.value)}
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white font-medium"
                          >
                            {rowModels.map((md) => (
                              <option key={md._id} value={md._id}>
                                {md.name}
                              </option>
                            ))}
                          </select>

                          <input
                            type="number"
                            value={row.yearFrom}
                            onChange={(e) =>
                              updateEditCompatRow(
                                idx,
                                "yearFrom",
                                parseInt(e.target.value, 10) || 2000
                              )
                            }
                            placeholder="From"
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white"
                          />

                          <input
                            type="number"
                            value={row.yearTo}
                            onChange={(e) =>
                              updateEditCompatRow(
                                idx,
                                "yearTo",
                                parseInt(e.target.value, 10) || 2025
                              )
                            }
                            placeholder="To"
                            className="text-xs border border-slate-300 rounded px-2 py-1.5 bg-white"
                          />

                          <button
                            type="button"
                            onClick={() => removeEditCompatRow(idx)}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                          >
                            Remove
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingPart(null)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSubmitting}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  {editSubmitting ? "Updating..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
