import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, PackageX } from "lucide-react";
import { VehicleSelector } from "../components/vehicle/VehicleSelector";
import { PartCard } from "../components/catalog/PartCard";
import { getCategories } from "../services/vehicle.service";
import { getParts } from "../services/part.service";
import { CategoryItem, PartItem } from "../types/catalog";
import { useGarage } from "../hooks/useGarage";

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { vehicle, clearVehicle } = useGarage();

  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [parts, setParts] = useState<PartItem[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 12,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const [searchInput, setSearchInput] = useState(searchParams.get("search") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const condition = searchParams.get("condition") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const search = searchParams.get("search") || "";
  const make = searchParams.get("make") || vehicle?.make || "";
  const model = searchParams.get("model") || vehicle?.model || "";
  const year = searchParams.get("year") || (vehicle?.year ? String(vehicle.year) : "");

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const fetchCatalog = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getParts({
        make,
        model,
        year,
        category,
        brand,
        condition,
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        search,
        sort,
        page,
        limit: 12,
      });
      setParts(res.parts);
      setPagination(res.pagination);
      setBrands(res.brands);
    } finally {
      setLoading(false);
    }
  }, [make, model, year, category, brand, condition, search, sort, page, searchParams]);

  useEffect(() => {
    void fetchCatalog();
  }, [fetchCatalog]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    if (key !== "page") {
      next.set("page", "1");
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam("search", searchInput.trim());
  };

  const handlePriceApply = (e: React.FormEvent) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPrice) next.set("minPrice", minPrice);
    else next.delete("minPrice");
    if (maxPrice) next.set("maxPrice", maxPrice);
    else next.delete("maxPrice");
    next.set("page", "1");
    setSearchParams(next);
  };

  const clearAllFilters = () => {
    setSearchInput("");
    setMinPrice("");
    setMaxPrice("");
    clearVehicle();
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Vehicle Selector Bar */}
      <VehicleSelector compact onSelected={() => void fetchCatalog()} />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Filters */}
        <aside
          className={`lg:w-64 shrink-0 space-y-6 ${mobileFiltersOpen ? "block" : "hidden lg:block"
            }`}
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl shadow-black/10 ring-1 ring-white/50">
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-red-600" /> Filters
              </h2>
              <button
                onClick={clearAllFilters}
                className="text-xs text-red-600 font-semibold hover:underline"
              >
                Reset all
              </button>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => updateParam("category", e.target.value)}
                className="w-full text-xs bg-white/80 border border-slate-300/80 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name} ({c.partCount ?? 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Brand
              </label>
              <select
                value={brand}
                onChange={(e) => updateParam("brand", e.target.value)}
                className="w-full text-xs bg-white/80 border border-slate-300/80 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
              >
                <option value="">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            {/* Condition */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2">
                Condition
              </label>
              <select
                value={condition}
                onChange={(e) => updateParam("condition", e.target.value)}
                className="w-full text-xs bg-white/80 border border-slate-300/80 rounded-xl px-2.5 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
              >
                <option value="">Any Condition</option>
                <option value="new">New</option>
                <option value="refurbished">Refurbished</option>
                <option value="used">Used</option>
              </select>
            </div>

            {/* Price Range */}
            <form onSubmit={handlePriceApply} className="space-y-2">
              <label className="block text-xs font-semibold text-slate-700">
                Price Range ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full text-xs bg-white/80 border border-slate-300/80 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full text-xs bg-white/80 border border-slate-300/80 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full py-1.5 bg-white hover:bg-slate-50 border border-slate-300/80 rounded-xl text-xs font-bold text-slate-800 transition shadow-xs cursor-pointer"
              >
                Apply Price
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 space-y-5">
          {/* Toolbar */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/70 rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl shadow-black/10 ring-1 ring-white/50">
            <form onSubmit={handleSearchSubmit} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search part name, brand, or OEM number..."
                  className="w-full text-xs sm:text-sm bg-white/80 border border-slate-300/80 rounded-2xl pl-9 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-red-500/40 focus:border-red-500 focus:bg-white transition"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchInput("");
                      updateParam("search", "");
                    }}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-red-600 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-md hover:shadow-red-500/30 transition-all cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="lg:hidden px-3 py-2 border border-slate-300 rounded-xl text-xs font-medium flex items-center gap-1.5 text-slate-700 bg-white/80"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
              </button>

              <select
                value={sort}
                onChange={(e) => updateParam("sort", e.target.value)}
                className="text-xs sm:text-sm bg-white/80 border border-slate-300/80 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500 focus:bg-white"
              >
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Name: A to Z</option>
              </select>
            </div>
          </div>

          {/* Count Summary */}
          <div className="flex items-center justify-between text-xs text-slate-700 bg-white/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/70 shadow-xs">
            <p>
              Showing <strong className="text-slate-900">{parts.length}</strong> of{" "}
              <strong className="text-slate-900">{pagination.total}</strong> parts
              {vehicle && (
                <span className="ml-1">
                  compatible with{" "}
                  <strong className="text-emerald-700">
                    {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                  </strong>
                </span>
              )}
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4.5">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-xl h-72 animate-pulse"
                />
              ))}
            </div>
          ) : parts.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center space-y-3">
              <PackageX className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-base font-semibold text-slate-900">
                No matching spare parts found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try clearing some filters or switching your selected vehicle to view all
                available catalog items.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-medium rounded-lg hover:bg-slate-800"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4.5">
                {parts.map((part) => (
                  <PartCard key={part._id} part={part} />
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                  <button
                    disabled={pagination.page <= 1}
                    onClick={() => updateParam("page", String(pagination.page - 1))}
                    className="p-2 border border-slate-300 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-medium text-slate-700 px-3">
                    Page {pagination.page} of {pagination.totalPages}
                  </span>
                  <button
                    disabled={pagination.page >= pagination.totalPages}
                    onClick={() => updateParam("page", String(pagination.page + 1))}
                    className="p-2 border border-slate-300 bg-white rounded-lg disabled:opacity-40 hover:bg-slate-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

