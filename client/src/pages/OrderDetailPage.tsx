import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
} from "lucide-react";
import { getOrderById, cancelOrder } from "../services/order.service";
import { OrderItem } from "../types/catalog";
import { useToast } from "../context/ToastContext";

export const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { showToast } = useToast();

  const justPlaced = (location.state as { justPlaced?: boolean })?.justPlaced;

  const [order, setOrder] = useState<OrderItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getOrderById(id)
      .then(setOrder)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load order");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!order || order.orderStatus !== "pending") return;
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    setCancelling(true);
    try {
      const updated = await cancelOrder(order._id);
      setOrder(updated);
      showToast("Order cancelled and stock restored");
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to cancel order", "error");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-3">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h1 className="text-lg font-bold text-slate-900">Unable to load order</h1>
        <p className="text-xs text-slate-500">{error}</p>
        <Link to="/orders" className="text-xs text-blue-600 hover:underline">
          Back to Order History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Top Action Bar (Hidden on Print) */}
      <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
        <Link
          to="/orders"
          className="text-xs font-medium text-slate-600 hover:text-slate-900 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>

        <div className="flex items-center gap-3">
          {order.orderStatus === "pending" && (
            <button
              onClick={handleCancel}
              disabled={cancelling}
              className="px-3.5 py-2 border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <XCircle className="w-3.5 h-3.5" />
              {cancelling ? "Cancelling..." : "Cancel Order"}
            </button>
          )}

          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Invoice
          </button>
        </div>
      </div>

      {justPlaced && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 text-xs text-emerald-900 print:hidden">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">Thank you! Your order has been confirmed.</p>
            <p>Order number: {order.orderNumber} &bull; Payment: Cash on Delivery</p>
          </div>
        </div>
      )}

      {/* Printable Invoice Card */}
      <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 sm:p-10 space-y-8 shadow-2xl shadow-black/15 ring-1 ring-white/50 print:border-0 print:p-0">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <img src="/logo.png" alt="AutoParts" className="h-12 w-auto object-contain mb-1" />
            <p className="text-xs text-slate-500">
              Genuine &amp; Aftermarket Automotive Parts
            </p>
            <p className="text-xs text-slate-500">Support: affan.codes01@gmail.com</p>
          </div>

          <div className="sm:text-right">
            <p className="text-xs uppercase font-semibold text-slate-400">Invoice / Receipt</p>
            <p className="text-base font-mono font-bold text-slate-900">{order.orderNumber}</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Date: {new Date(order.createdAt).toLocaleString()}
            </p>
            <p className="text-xs font-semibold uppercase mt-1 text-slate-800">
              Status: {order.orderStatus}
            </p>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
          <div className="space-y-1">
            <p className="font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" /> Ship To
            </p>
            <p className="font-semibold text-slate-800">{order.shippingAddress.name}</p>
            <p className="text-slate-600">{order.shippingAddress.street}</p>
            <p className="text-slate-600">
              {order.shippingAddress.city}, {order.shippingAddress.postalCode}
            </p>
            <p className="text-slate-600">{order.shippingAddress.country}</p>
            <p className="text-slate-600">Phone: {order.shippingAddress.phone}</p>
          </div>

          <div className="space-y-1 sm:text-right">
            <p className="font-bold text-slate-900 uppercase tracking-wider">Payment Details</p>
            <p className="text-slate-600">Method: {order.paymentMethod}</p>
            <p className="text-slate-600 capitalize">Payment Status: {order.paymentStatus}</p>
            {order.notes && (
              <p className="text-slate-500 italic mt-2">Note: &ldquo;{order.notes}&rdquo;</p>
            )}
          </div>
        </div>

        {/* Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-200 text-slate-500 uppercase">
                <th className="py-2.5 pr-4">Part Description</th>
                <th className="py-2.5 pr-4">SKU / OEM</th>
                <th className="py-2.5 pr-4 text-right">Unit Price</th>
                <th className="py-2.5 pr-4 text-center">Qty</th>
                <th className="py-2.5 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <tr key={idx} className="text-slate-800">
                  <td className="py-3 pr-4 font-medium">{item.name}</td>
                  <td className="py-3 pr-4 font-mono text-slate-500">{item.partNumber}</td>
                  <td className="py-3 pr-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 pr-4 text-center">{item.quantity}</td>
                  <td className="py-3 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <div className="w-full max-w-xs space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Items Subtotal</span>
              <span>${order.subtotalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span>
                {order.shippingFee === 0 ? "FREE" : `$${order.shippingFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base text-slate-900 pt-2 border-t border-slate-200">
              <span>Grand Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

