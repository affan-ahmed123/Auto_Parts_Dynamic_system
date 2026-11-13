import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  Globe,
  ShoppingCart,
  ShieldCheck,
  ArrowLeft,
  Minus,
  Plus,
} from "lucide-react";
import { getPartDetail } from "../services/part.service";
import { PartItem } from "../types/catalog";
import { useGarage } from "../hooks/useGarage";
import { useCart } from "../hooks/useCart";
import { useToast } from "../context/ToastContext";
import { PartCard } from "../components/catalog/PartCard";
import { resolveImageUrl, handleImageError } from "../utils/image";

export const PartDetailPage: React.FC = () => {
  const { idOrSlug } = useParams<{ idOrSlug: string }>();
  const { vehicle } = useGarage();
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const [part, setPart] = useState<PartItem | null>(null);
  const [relatedParts, setRelatedParts] = useState<PartItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idOrSlug) return;
    setLoading(true);
    setError(null);
    getPartDetail(idOrSlug)
      .then((res) => {
        setPart(res.part);
        setRelatedParts(res.relatedParts);
        const catName =
          typeof res.part.category === "object" && res.part.category !== null
            ? res.part.category.name
            : undefined;
        setSelectedImage(resolveImageUrl(res.part.images?.[0], catName));
        setQuantity(1);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load spare part");
      })
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const isCompatible = React.useMemo(() => {
    if (!part || !vehicle) return null;
    if (part.isUniversal) return true;
    return part.compatibility.some((c) => {
      const makeMatch =
        typeof c.make === "object" ? c.make?._id === vehicle.make : c.make === vehicle.make;
      const modelMatch =
        typeof c.model === "object" ? c.model?._id === vehicle.model : c.model === vehicle.model;
      return makeMatch && modelMatch && vehicle.year >= c.yearFrom && vehicle.year <= c.yearTo;
    });
  }, [part, vehicle]);

  const handleAddToCart = async () => {
    if (!part || part.stock <= 0) return;
    await addToCart(part, quantity);
    showToast(`Added ${quantity} x ${part.name} to cart`);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white border border-slate-200 rounded-xl h-96 animate-pulse" />
      </div>
    );
  }

  if (error || !part) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-xl font-bold text-slate-900">Part Not Found</h1>
        <p className="text-sm text-slate-500">{error || "Unable to locate this part."}</p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>
      </div>
    );
  }

  const finalPrice =
    part.discountPrice !== null && part.discountPrice !== undefined
      ? part.discountPrice
      : part.price;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-700 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-white/60 shadow-sm w-fit">
        <Link to="/catalog" className="hover:text-slate-900 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Catalog
        </Link>
        <span>/</span>
        {part.category && (
          <>
            <Link
              to={`/catalog?category=${part.category._id}`}
              className="hover:text-slate-900"
            >
              {part.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-slate-800 font-medium truncate">{part.name}</span>
      </div>

      {/* Main Product Area */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 shadow-2xl shadow-black/15 ring-1 ring-white/50">
        {/* Image Gallery */}
        <div className="lg:col-span-5 space-y-3">
          <div className="bg-slate-50 border border-slate-200 rounded-xl aspect-square flex items-center justify-center overflow-hidden p-6">
            <img
              src={selectedImage}
              alt={part.name}
              className="w-full h-full object-contain"
              onError={(e) =>
                handleImageError(
                  e,
                  typeof part?.category === "object" ? part?.category?.name : undefined
                )
              }
            />
          </div>
          {part.images && part.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {part.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(resolveImageUrl(img))}
                  className={`w-16 h-16 rounded-lg border overflow-hidden shrink-0 bg-slate-50 p-1 ${selectedImage === resolveImageUrl(img)
                      ? "border-slate-900 ring-1 ring-slate-900"
                      : "border-slate-200"
                    }`}
                >
                  <img
                    src={resolveImageUrl(img)}
                    alt=""
                    className="w-full h-full object-contain"
                    onError={(e) =>
                      handleImageError(
                        e,
                        typeof part?.category === "object"
                          ? part?.category?.name
                          : undefined
                      )
                    }
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details & Purchase */}
        <div className="lg:col-span-7 space-y-5">
          {/* Compatibility Alert Banner */}
          {vehicle ? (
            <div
              className={`p-3.5 rounded-xl border flex items-center gap-2.5 text-sm font-medium ${isCompatible
                  ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                  : "bg-red-50 border-red-200 text-red-900"
                }`}
            >
              {isCompatible ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Fits your{" "}
                    <strong>
                      {vehicle.makeName} {vehicle.modelName} {vehicle.year}
                    </strong>
                  </span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <span>
                    Does not fit your{" "}
                    <strong>
                      {vehicle.makeName} {vehicle.modelName} {vehicle.year}
                    </strong>
                  </span>
                </>
              )}
            </div>
          ) : part.isUniversal ? (
            <div className="p-3.5 rounded-xl border bg-blue-50 border-blue-200 text-blue-900 flex items-center gap-2.5 text-sm font-medium">
              <Globe className="w-5 h-5 text-blue-600 shrink-0" />
              <span>Universal Fit &mdash; Designed to fit most standard vehicles</span>
            </div>
          ) : null}

          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {part.brand} &bull; OEM / SKU: {part.partNumber}
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              {part.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-extrabold text-slate-900">
              ${finalPrice.toFixed(2)}
            </span>
            {part.discountPrice && (
              <span className="text-base text-slate-400 line-through">
                ${part.price.toFixed(2)}
              </span>
            )}
          </div>

          <p className="text-sm text-slate-600 leading-relaxed">{part.description}</p>

          {/* Specs Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[11px] text-slate-500">Condition</p>
              <p className="text-xs font-semibold text-slate-900 capitalize mt-0.5">
                {part.condition}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[11px] text-slate-500">Warranty</p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {part.warrantyMonths} Months
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[11px] text-slate-500">Category</p>
              <p className="text-xs font-semibold text-slate-900 mt-0.5">
                {part.category?.name || "General"}
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <p className="text-[11px] text-slate-500">Availability</p>
              <p
                className={`text-xs font-semibold mt-0.5 ${part.stock > 0 ? "text-emerald-700" : "text-red-600"
                  }`}
              >
                {part.stock > 0 ? `${part.stock} in stock` : "Out of stock"}
              </p>
            </div>
          </div>

          {/* Add to Cart Controls */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4">
            <div className="flex items-center border border-slate-300 rounded-lg bg-white">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2.5 text-slate-600 hover:text-slate-900"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 text-sm font-semibold text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(Math.min(part.stock || 1, quantity + 1))}
                className="p-2.5 text-slate-600 hover:text-slate-900"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={part.stock <= 0}
              className="flex-1 sm:flex-initial px-8 py-3 bg-slate-900 hover:bg-red-600 disabled:opacity-40 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-red-500/25 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>{part.stock > 0 ? "Add to Cart" : "Out of Stock"}</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Ships within 24 hours &bull; Cash on Delivery available
          </p>
        </div>
      </div>

      {/* Compatibility Matrix Table */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/15 ring-1 ring-white/50">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Vehicle Fitment Chart</h2>
        {part.isUniversal ? (
          <p className="text-sm text-slate-600">
            This is a universal component compatible with standard passenger cars and SUVs.
          </p>
        ) : part.compatibility.length === 0 ? (
          <p className="text-sm text-slate-500">No specific vehicle rows listed.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs text-slate-500 uppercase">
                  <th className="py-2.5 pr-4">Make</th>
                  <th className="py-2.5 pr-4">Model</th>
                  <th className="py-2.5">Model Years</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {part.compatibility.map((c, idx) => (
                  <tr key={idx} className="text-slate-700">
                    <td className="py-2.5 pr-4 font-medium">{c.make?.name || "-"}</td>
                    <td className="py-2.5 pr-4">{c.model?.name || "-"}</td>
                    <td className="py-2.5">
                      {c.yearFrom} &ndash; {c.yearTo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Related Parts */}
      {relatedParts.length > 0 && (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/15 ring-1 ring-white/50">
          <h2 className="text-lg font-bold text-slate-900">Related Spare Parts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4.5">
            {relatedParts.map((rel) => (
              <PartCard key={rel._id} part={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

