import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Globe, ShoppingCart } from "lucide-react";
import { PartItem } from "../../types/catalog";
import { useGarage } from "../../hooks/useGarage";
import { useCart } from "../../hooks/useCart";
import { useToast } from "../../context/ToastContext";
import { resolveImageUrl, handleImageError } from "../../utils/image";

interface PartCardProps {
  part: PartItem;
}

export const PartCard: React.FC<PartCardProps> = ({ part }) => {
  const { vehicle } = useGarage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isCompatible = React.useMemo(() => {
    if (!vehicle) return null;
    if (part.isUniversal) return true;
    return part.compatibility.some((c) => {
      const makeMatches =
        typeof c.make === "object" ? c.make?._id === vehicle.make : c.make === vehicle.make;
      const modelMatches =
        typeof c.model === "object" ? c.model?._id === vehicle.model : c.model === vehicle.model;
      const yearMatches = vehicle.year >= c.yearFrom && vehicle.year <= c.yearTo;
      return makeMatches && modelMatches && yearMatches;
    });
  }, [part, vehicle]);

  const price =
    part.discountPrice !== null && part.discountPrice !== undefined
      ? part.discountPrice
      : part.price;

  const handleAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (part.stock <= 0) return;
    await addToCart(part);
    showToast(`Added ${part.name} to cart`);
  };

  const categoryName =
    typeof part.category === "object" && part.category !== null
      ? part.category.name
      : undefined;

  const imageSrc = resolveImageUrl(part.images?.[0], categoryName);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 350, damping: 25 }}
      className="bg-white/80 hover:bg-white/92 backdrop-blur-xl border border-white/70 hover:border-red-500/60 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-2xl hover:shadow-red-500/10 shadow-lg transition-all duration-300 group relative w-full"
    >
      <div>
        {/* Top Image Frame with Automotive Studio Lighting */}
        <Link
          to={`/parts/${part.slug}`}
          className="block relative bg-gradient-to-b from-white/95 via-slate-50/70 to-white/85 aspect-square sm:aspect-video overflow-hidden border-b border-white/60 p-2 sm:p-3"
        >
          <img
            src={imageSrc}
            alt={part.name}
            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-sm"
            loading="lazy"
            onError={(e) => handleImageError(e, categoryName)}
          />

          {/* Badges Top Left & Right */}
          <div className="absolute top-1.5 left-1.5 sm:top-2.5 sm:left-2.5 flex items-center gap-1">
            {part.discountPrice && (
              <span className="bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-black px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-md tracking-wider uppercase">
                SALE
              </span>
            )}
          </div>

          <div className="absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5">
            <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-semibold px-1.5 sm:px-2 py-0.5 rounded-full capitalize shadow-xs">
              {part.condition}
            </span>
          </div>
        </Link>

        {/* Content Details */}
        <div className="p-2.5 sm:p-4 space-y-1.5 sm:space-y-2.5">
          {/* Fitment Indicator Badge */}
          {vehicle ? (
            <div>
              {isCompatible ? (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-xs truncate max-w-full">
                  <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
                  <span className="truncate">Fits {vehicle.modelName}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 sm:px-2.5 py-0.5 rounded-full truncate max-w-full">
                  <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-500 shrink-0" />
                  <span className="truncate">Does not fit</span>
                </span>
              )}
            </div>
          ) : part.isUniversal ? (
            <span className="inline-flex items-center gap-1 text-[9px] sm:text-[11px] font-bold text-sky-800 bg-sky-50 border border-sky-300 px-1.5 sm:px-2.5 py-0.5 rounded-full shadow-xs">
              <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-sky-600 shrink-0" />
              <span>Universal Fit</span>
            </span>
          ) : null}

          {/* SKU & Brand */}
          <div>
            <p className="text-[9px] sm:text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider truncate">
              {part.brand} &bull; <span className="text-slate-700">{part.partNumber}</span>
            </p>
            <Link
              to={`/parts/${part.slug}`}
              className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-red-600 line-clamp-2 transition-colors mt-0.5 leading-snug"
              title={part.name}
            >
              {part.name}
            </Link>
          </div>

          {/* Description snippet (hidden on small mobile 2-col to keep cards neat) */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed hidden sm:block">
            {part.description}
          </p>
        </div>
      </div>

      {/* Card Footer: Pricing & Action Button */}
      <div className="p-2.5 sm:p-4 pt-2 sm:pt-3 border-t border-white/60 flex items-center justify-between bg-white/40 backdrop-blur-xs">
        <div className="min-w-0 pr-1">
          <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
            <span className="text-sm sm:text-lg font-black text-slate-900 truncate">
              ${price.toFixed(2)}
            </span>
            {part.discountPrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ${part.price.toFixed(2)}
              </span>
            )}
          </div>
          <p className="text-[9px] sm:text-[11px]">
            {part.stock > 0 ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span className="hidden sm:inline">In Stock</span> ({part.stock})
              </span>
            ) : (
              <span className="text-rose-600 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 inline-block" />
                Out of Stock
              </span>
            )}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
          onClick={handleAdd}
          disabled={part.stock <= 0}
          className="p-2 sm:p-2.5 bg-slate-900 hover:bg-red-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg sm:rounded-xl shadow-md hover:shadow-red-500/30 transition-all shrink-0"
          title="Add to cart"
        >
          <ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};
