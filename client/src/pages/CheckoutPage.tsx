import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Truck, AlertCircle } from "lucide-react";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../services/order.service";
import { useToast } from "../context/ToastContext";

export const CheckoutPage: React.FC = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || "54000");
  const [country, setCountry] = useState(user?.address?.country || "Pakistan");
  const [notes, setNotes] = useState("");

  const [paymentMethod] = useState<"COD">("COD");
  const [isPlacing, setIsPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shippingFee = subtotal >= 150 ? 0 : 10;
  const grandTotal = subtotal + shippingFee;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsPlacing(true);
    setError(null);

    try {
      const order = await placeOrder({
        guestEmail: !isAuthenticated ? email : undefined,
        items: items.map((i) => ({ partId: i.part._id, quantity: i.quantity })),
        shippingAddress: {
          name,
          phone,
          street,
          city,
          postalCode,
          country,
        },
        paymentMethod,
        notes,
      });

      clearCart();
      showToast("Order placed successfully!");
      navigate(`/orders/${order._id}`, { state: { justPlaced: true } });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to place order.");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-slate-900 border-b border-slate-200 pb-4">
        Checkout
      </h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to process order</p>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl shadow-black/15 ring-1 ring-white/50">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-3">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Recipient Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 0000000"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              {!isAuthenticated && (
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Email Address (for order tracking)
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="customer@example.com"
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                  />
                </div>
              )}

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Street Address / House No.
                </label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Street 10, House 4B"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Lahore"
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Postal Code</label>
                <input
                  type="text"
                  required
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Drop at front gate or call upon arrival..."
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 space-y-3 shadow-2xl shadow-black/15 ring-1 ring-white/50">
            <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200/60 pb-3">
              2. Payment Method
            </h2>
            <div className="p-4 border border-slate-900/40 bg-white/70 backdrop-blur-xs rounded-2xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-50/90 rounded-xl text-red-600 border border-red-200">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">Cash on Delivery (COD)</p>
                  <p className="text-[11px] text-slate-500">Pay cash upon parcel physical delivery</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">Available</span>
            </div>
          </div>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl shadow-black/15 ring-1 ring-white/50">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-200/60 pb-3">
            Items in Order ({items.length})
          </h2>

          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 pr-1">
            {items.map(({ part, quantity }) => {
              const unitPrice =
                part.discountPrice !== null && part.discountPrice !== undefined
                  ? part.discountPrice
                  : part.price;
              return (
                <div key={part._id} className="py-2.5 flex justify-between items-center text-xs">
                  <div className="pr-2">
                    <p className="font-semibold text-slate-900 truncate max-w-[200px]">{part.name}</p>
                    <p className="text-[11px] text-slate-400">Qty: {quantity} &bull; SKU: {part.partNumber}</p>
                  </div>
                  <span className="font-bold text-slate-900">${(unitPrice * quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-200/60">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span className="font-semibold text-slate-900">
                {shippingFee === 0 ? "FREE" : `$${shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-2 border-t border-slate-200/60 text-sm font-bold text-slate-900">
              <span>Total to Pay</span>
              <span className="text-xl font-black">${grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPlacing || items.length === 0}
            className="w-full py-3.5 bg-slate-900 hover:bg-red-600 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md hover:shadow-red-500/30 transition-all cursor-pointer"
          >
            {isPlacing ? "Processing Order..." : "Confirm & Place Order (COD)"}
          </button>

          <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Stock is reserved atomically upon order confirmation
          </p>
        </div>
      </form>
    </div>
  );
};

