import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, ShieldCheck } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { resolveImageUrl, handleImageError } from "../utils/image";

export const CartPage: React.FC = () => {
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const shippingFee = subtotal >= 150 ? 0 : items.length > 0 ? 10 : 0;
  const grandTotal = subtotal + shippingFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center space-y-4 bg-white/95 backdrop-blur-md border border-white/60 rounded-2xl shadow-xl my-12">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Your Cart is Empty</h1>
        <p className="text-sm text-slate-500">
          Looks like you haven&apos;t added any spare parts to your cart yet.
        </p>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between bg-white/92 backdrop-blur-md border border-white/60 rounded-xl px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs text-slate-500 hover:text-red-600 transition"
        >
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl divide-y divide-white/60 overflow-hidden shadow-2xl shadow-black/15 ring-1 ring-white/50">
          {items.map(({ part, quantity }) => {
            const unitPrice =
              part.discountPrice !== null && part.discountPrice !== undefined
                ? part.discountPrice
                : part.price;
            const lineTotal = unitPrice * quantity;

            return (
              <div key={part._id} className="p-4 sm:p-5 flex gap-4 items-center">
                <Link
                  to={`/parts/${part.slug}`}
                  className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-lg p-2 shrink-0 flex items-center justify-center"
                >
                  <img
                    src={resolveImageUrl(part.images?.[0])}
                    alt={part.name}
                    className="w-full h-full object-contain"
                    onError={(e) => handleImageError(e)}
                  />
                </Link>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase">
                    {part.brand} &bull; {part.partNumber}
                  </p>
                  <Link
                    to={`/parts/${part.slug}`}
                    className="text-sm font-semibold text-slate-900 hover:text-blue-600 truncate block"
                  >
                    {part.name}
                  </Link>
                  <p className="text-xs text-slate-500">
                    ${unitPrice.toFixed(2)} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center border border-slate-300 rounded-md">
                  <button
                    onClick={() => updateQuantity(part._id, quantity - 1)}
                    className="p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-2.5 text-xs font-semibold text-slate-900">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(part._id, Math.min(part.stock, quantity + 1))}
                    disabled={quantity >= part.stock}
                    className="p-1.5 text-slate-500 hover:text-slate-800 disabled:opacity-30"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right min-w-[70px]">
                  <p className="text-sm font-bold text-slate-900">${lineTotal.toFixed(2)}</p>
                </div>

                <button
                  onClick={() => removeFromCart(part._id)}
                  className="p-2 text-slate-400 hover:text-red-600 transition"
                  title="Remove item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-7 space-y-5 shadow-2xl shadow-black/15 ring-1 ring-white/50">
          <h2 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-200/60">
            Order Summary
          </h2>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            {subtotal < 150 && (
              <p className="text-[11px] text-slate-500">
                Add ${(150 - subtotal).toFixed(2)} more for free nationwide delivery.
              </p>
            )}
          </div>

          <div className="pt-3 border-t border-slate-200/60 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-900">Total</span>
            <span className="text-2xl font-black text-slate-900">
              ${grandTotal.toFixed(2)}
            </span>
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full py-3.5 bg-slate-900 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-red-500/30 cursor-pointer"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Cash on Delivery &bull; Server Verified Pricing
          </p>
        </div>
      </div>
    </div>
  );
};

