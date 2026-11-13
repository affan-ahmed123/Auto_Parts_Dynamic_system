import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Wrench,
  ShieldCheck,
  Truck,
  ChevronRight,
  Disc,
  Cpu,
  Layers,
  Filter,
  Zap,
  Car,
  Lightbulb,
  CircleDot,
  Droplet,
  Sparkles,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";
import { VehicleSelector } from "../components/vehicle/VehicleSelector";
import { PartCard } from "../components/catalog/PartCard";
import { getCategories } from "../services/vehicle.service";
import { getParts } from "../services/part.service";
import { CategoryItem, PartItem } from "../types/catalog";
import { useGarage } from "../hooks/useGarage";

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("brake")) return <Disc className="w-5 h-5 text-red-600" />;
  if (n.includes("engine")) return <Cpu className="w-5 h-5 text-amber-600" />;
  if (n.includes("suspension")) return <Layers className="w-5 h-5 text-indigo-600" />;
  if (n.includes("filter")) return <Filter className="w-5 h-5 text-cyan-600" />;
  if (n.includes("electr") || n.includes("spark")) return <Zap className="w-5 h-5 text-amber-500" />;
  if (n.includes("body")) return <Car className="w-5 h-5 text-slate-700" />;
  if (n.includes("light")) return <Lightbulb className="w-5 h-5 text-yellow-500" />;
  if (n.includes("tyre") || n.includes("wheel")) return <CircleDot className="w-5 h-5 text-slate-800" />;
  if (n.includes("oil") || n.includes("fluid")) return <Droplet className="w-5 h-5 text-blue-600" />;
  return <Wrench className="w-5 h-5 text-slate-600" />;
};

export const HomePage: React.FC = () => {
  const { vehicle, clearVehicle } = useGarage();
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [featuredParts, setFeaturedParts] = useState<PartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const featuredRef = useRef<HTMLDivElement | null>(null);

  // Load Categories on mount
  useEffect(() => {
    let isMounted = true;
    getCategories().then((cats) => {
      if (isMounted) setCategories(cats);
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch Parts ONLY when a Category or Vehicle Model is selected
  const hasSelection = Boolean(vehicle || selectedCategory);

  useEffect(() => {
    if (!hasSelection) {
      setFeaturedParts([]);
      setLoading(false);
      return;
    }

    let isMounted = true;
    setLoading(true);

    getParts({
      make: vehicle?.make,
      model: vehicle?.model,
      year: vehicle?.year ? String(vehicle.year) : undefined,
      category: selectedCategory || undefined,
      limit: 8,
      inStock: "true",
    })
      .then((partsRes) => {
        if (isMounted) {
          setFeaturedParts(partsRes.parts);
        }
      })
      .catch((err) => {
        console.warn("Failed to load featured parts:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [vehicle, selectedCategory, hasSelection]);

  const handleCategoryClick = (catId: string) => {
    setSelectedCategory(catId);
    if (featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const selectedCategoryObj = categories.find((c) => c._id === selectedCategory);

  return (
    <div className="space-y-10 pb-16 pt-3 sm:pt-5">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/80 backdrop-blur-2xl border border-white/70 shadow-2xl shadow-black/15 ring-1 ring-white/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Headline */}
            <div className="lg:col-span-6 space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 leading-[1.15]">
                Quality replacement auto parts for your car.
              </h1>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-xl">
                Select your vehicle make, model, and year to see only compatible parts.
                We carry genuine OEM and certified aftermarket parts across engines,
                brakes, suspensions, filters, and electronics.
              </p>
              <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs border border-white/80 px-3.5 py-1.5 rounded-full shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> 12-Month Warranty
                </span>
                <span className="flex items-center gap-1.5 bg-white/70 backdrop-blur-xs border border-white/80 px-3.5 py-1.5 rounded-full shadow-xs">
                  <Truck className="w-4 h-4 text-slate-800" /> Cash on Delivery Available
                </span>
              </div>
            </div>

            {/* Right: Vehicle Compatibility Box */}
            <div className="lg:col-span-6">
              <VehicleSelector />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 shadow-2xl shadow-black/15 ring-1 ring-white/40 rounded-3xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Popular Categories
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any category to filter and view spare parts below
              </p>
            </div>
            <Link
              to="/catalog"
              className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1 bg-white/70 hover:bg-white px-3.5 py-2 rounded-full border border-slate-200/80 transition shadow-xs"
            >
              All Categories <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {categories.slice(0, 10).map((cat) => {
              const isSelected = selectedCategory === cat._id;
              return (
                <motion.div
                  key={cat._id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                >
                  <button
                    type="button"
                    onClick={() => handleCategoryClick(cat._id)}
                    className={`w-full text-left rounded-2xl p-4 transition-all duration-300 group flex flex-col justify-between h-full border ${isSelected
                        ? "bg-red-50/90 border-red-500 shadow-xl ring-2 ring-red-500/30 backdrop-blur-md"
                        : "bg-white/70 hover:bg-white/95 backdrop-blur-md border-white/80 hover:border-red-400 hover:shadow-xl shadow-sm hover:bg-gradient-to-b hover:from-white/95 hover:to-red-50/20"
                      }`}
                  >
                    <div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all ${isSelected
                            ? "bg-red-600 text-white shadow-md shadow-red-500/30"
                            : "bg-white/80 border border-slate-100 group-hover:scale-110 group-hover:bg-red-50 group-hover:border-red-100 shadow-xs"
                          }`}
                      >
                        {getCategoryIcon(cat.name)}
                      </div>
                      <p
                        className={`font-bold text-sm transition-colors ${isSelected
                            ? "text-red-700 font-extrabold"
                            : "text-slate-900 group-hover:text-red-600"
                          }`}
                      >
                        {cat.name}
                      </p>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                        {cat.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-100/80 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 group-hover:text-slate-600">
                        {cat.partCount ?? 0} parts
                      </span>
                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-red-600 group-hover:translate-x-0.5 transition" />
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED PARTS SECTION (SHOWS ONLY WHEN CATEGORY OR MODEL IS SELECTED) */}
      <section ref={featuredRef} id="featured-parts-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 shadow-2xl shadow-black/15 ring-1 ring-white/40 rounded-3xl p-6 sm:p-8 space-y-6">
          {/* Header & Filter Controls */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/60 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-red-50 text-red-600">
                  <Sparkles className="w-4 h-4" />
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  Featured Spare Parts
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {hasSelection ? (
                  <span>
                    Showing parts for:{" "}
                    {vehicle && (
                      <strong className="text-emerald-700">
                        {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                      </strong>
                    )}
                    {vehicle && selectedCategoryObj && " • "}
                    {selectedCategoryObj && (
                      <strong className="text-red-700">{selectedCategoryObj.name}</strong>
                    )}
                  </span>
                ) : (
                  <span>Select a category or vehicle model to view compatible parts</span>
                )}
              </p>
            </div>

            {/* Quick Actions (Reset or Catalog link) */}
            <div className="flex items-center gap-2">
              {hasSelection && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory("");
                    clearVehicle();
                  }}
                  className="px-3.5 py-1.5 bg-white/70 hover:bg-white text-slate-700 text-xs font-semibold rounded-full flex items-center gap-1.5 border border-slate-200/70 transition shadow-xs"
                  title="Reset filters"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>
              )}
              <Link
                to={
                  vehicle
                    ? `/catalog?make=${vehicle.make}&model=${vehicle.model}&year=${vehicle.year}${selectedCategory ? `&category=${selectedCategory}` : ""
                    }`
                    : selectedCategory
                      ? `/catalog?category=${selectedCategory}`
                      : "/catalog"
                }
                className="text-xs font-bold text-slate-700 hover:text-red-600 flex items-center gap-1 bg-white/70 hover:bg-white px-3.5 py-2 rounded-full border border-slate-200/80 transition shadow-xs"
              >
                View Full Catalog <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Interactive Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              Categories:
            </span>
            <button
              type="button"
              onClick={() => setSelectedCategory("")}
              className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition ${!selectedCategory
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
            >
              All Categories
            </button>
            {categories.map((c) => {
              const active = selectedCategory === c._id;
              return (
                <button
                  key={c._id}
                  type="button"
                  onClick={() => setSelectedCategory(c._id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition flex items-center gap-1.5 ${active
                      ? "bg-red-600 text-white shadow-md shadow-red-500/30"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                >
                  <span>{c.name}</span>
                </button>
              );
            })}
          </div>

          {/* MAIN CONTENT: IF NOT SELECTED -> SHOW PROMPT, IF SELECTED -> SHOW PARTS */}
          {!hasSelection ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-12 px-6 text-center space-y-4 bg-gradient-to-b from-slate-50/60 to-slate-100/40 rounded-2xl border border-dashed border-slate-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto text-red-600 shadow-sm">
                <Car className="w-8 h-8" />
              </div>

              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-lg font-bold text-slate-900">
                  Select a Category or Vehicle Model
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Featured spare parts are shown once you select your car model from the garage selector or pick a category above to guarantee 100% fitment.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 max-w-xl mx-auto">
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => handleCategoryClick(cat._id)}
                    className="px-3 py-1.5 bg-white hover:bg-red-50 text-slate-800 hover:text-red-700 border border-slate-200 hover:border-red-300 rounded-full text-xs font-semibold shadow-xs transition"
                  >
                    + {cat.name}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white border border-slate-200 rounded-2xl p-4 h-72 animate-pulse"
                />
              ))}
            </div>
          ) : featuredParts.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
              <p className="text-sm font-bold text-slate-800">
                No parts found matching this specific filter.
              </p>
              <p className="text-xs text-slate-500">
                Try selecting another category or clear your car filter to explore other options.
              </p>
              <button
                type="button"
                onClick={() => setSelectedCategory("")}
                className="px-4 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-full text-xs font-bold transition shadow-sm"
              >
                Show All Categories
              </button>
            </div>
          ) : (
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4"
              >
                {featuredParts.map((part) => (
                  <PartCard key={part._id} part={part} />
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* Trust & Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-2xl shadow-black/15 ring-1 ring-white/40">
          <div className="space-y-1.5 p-3 rounded-2xl hover:bg-white/60 transition">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Direct Fit Guarantee
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              If our vehicle filter indicates a part fits your vehicle and it does not, return
              it within 14 days for a replacement or full refund.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl hover:bg-white/60 transition">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-slate-800" /> Cash on Delivery Nationwide
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Pay upon physical inspection when your package arrives at your doorstep or workshop.
            </p>
          </div>

          <div className="space-y-1.5 p-3 rounded-2xl hover:bg-white/60 transition">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-red-600" /> Genuine OEM &amp; Verified Brands
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sourced from certified manufacturers including Brembo, Bosch, Denso, NGK, KYB,
              and Mann-Filter.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
