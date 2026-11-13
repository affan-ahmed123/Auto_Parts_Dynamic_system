import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ChevronRight } from "lucide-react";
import { getMyOrders } from "../services/order.service";
import { OrderItem } from "../types/catalog";

export const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "confirmed":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      case "pending":
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="bg-white/92 backdrop-blur-md border border-white/60 rounded-xl px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Order History</h1>
        <p className="text-xs text-slate-500 mt-1">
          Track packages and review past replacement parts purchases
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-12 text-center space-y-3 shadow-2xl shadow-black/15 ring-1 ring-white/50">
          <Package className="w-10 h-10 text-slate-300 mx-auto" />
          <h2 className="text-base font-semibold text-slate-900">No Orders Yet</h2>
          <p className="text-xs text-slate-500">
            Once you order replacement parts, your tracking and status will show up here.
          </p>
          <Link
            to="/catalog"
            className="inline-block px-5 py-2.5 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-red-500/25 transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/orders/${order._id}`}
              className="bg-white/80 hover:bg-white/92 backdrop-blur-xl border border-white/70 hover:border-red-400/80 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-xl shadow-black/10 hover:shadow-2xl group ring-1 ring-white/50"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-sm text-slate-900">
                    {order.orderNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${getStatusBadge(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} &bull;{" "}
                  {order.items.length} {order.items.length === 1 ? "item" : "items"}
                </p>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4">
                <div className="text-right">
                  <p className="text-xs text-slate-400">Total Amount</p>
                  <p className="text-base font-extrabold text-slate-900">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-800 transition" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
