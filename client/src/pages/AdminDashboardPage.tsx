import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  ShoppingCart,
  Users,
  AlertTriangle,
  Package,
  Printer,
  Store,
  TrendingUp,
  Layers,
  Wrench,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  X,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  getDashboard,
  getAllOrders,
  updateOrderStatus,
  restockPart,
  DashboardData,
} from "../services/admin.service";
import { OrderItem } from "../types/catalog";
import { useToast } from "../context/ToastContext";
import { AdminPartsTab } from "../components/admin/AdminPartsTab";
import { AdminMetaTab } from "../components/admin/AdminMetaTab";

export const AdminDashboardPage: React.FC = () => {
  const { showToast } = useToast();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"overview" | "parts" | "vehicles" | "logs">("overview");
  const [data, setData] = useState<DashboardData | null>(null);
  const [allOrders, setAllOrders] = useState<OrderItem[]>([]);
  const [orderFilter, setOrderFilter] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [restockModalPart, setRestockModalPart] = useState<{ id: string; name: string } | null>(null);
  const [restockQty, setRestockQty] = useState<number>(10);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dash, orders] = await Promise.all([
        getDashboard(),
        getAllOrders(orderFilter || undefined),
      ]);
      setData(dash);
      setAllOrders(orders);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to load admin stats", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, [orderFilter]);

  const handleStatusChange = async (orderId: string, status: OrderItem["orderStatus"]) => {
    try {
      await updateOrderStatus(orderId, status);
      showToast(`Order status updated to ${status}`);
      void loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to update status", "error");
    }
  };

  const handleRestockSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalPart || restockQty <= 0) return;
    try {
      await restockPart(restockModalPart.id, restockQty, "Admin manual restock");
      showToast(`Restocked ${restockQty} units for ${restockModalPart.name}`);
      setRestockModalPart(null);
      void loadData();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to restock", "error");
    }
  };

  const metrics = data?.metrics;

  const getStatusBadge = (status: OrderItem["orderStatus"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-600" /> Pending
          </span>
        );
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-300">
            <CheckCircle2 className="w-3 h-3 text-blue-600" /> Confirmed
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-300">
            <Truck className="w-3 h-3 text-purple-600" /> Shipped
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Delivered
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3 text-rose-600" /> Cancelled
          </span>
        );
      default:
        return <span className="capitalize text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-6">
      {/* Standalone Single Admin Operations Top Navbar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-full px-5 sm:px-7 py-3 shadow-xl shadow-slate-900/5 flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-2 sm:top-3 z-50 hover:shadow-2xl transition-all"
      >
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2.5 group">
            <motion.img
              whileHover={{ scale: 1.06 }}
              src="/logo.png"
              alt="AA Auto Parts"
              className="h-9 sm:h-10 w-auto object-contain drop-shadow-xs"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none group-hover:text-red-600 transition-colors">
                  AA Auto Parts
                </span>
                <span className="bg-red-50 text-red-700 border border-red-300 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                  ADMIN HUB
                </span>
              </div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 hidden sm:block">
                Central Operations &amp; Inventory Management
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3 self-end md:self-auto">
          {user && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-bold text-slate-700 border border-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>{user.name.split(" ")[0]}</span>
            </div>
          )}

          <Link
            to="/catalog"
            className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-full flex items-center gap-1.5 transition border border-slate-300 shadow-xs"
            title="Browse store catalog as customer"
          >
            <Store className="w-3.5 h-3.5 text-slate-600" />
            <span>Store Front</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate("/admin");
            }}
            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/95 backdrop-blur-md border border-slate-300 rounded-2xl p-2 shadow-sm">
        {[
          { key: "overview", label: "Executive Overview", icon: TrendingUp },
          { key: "parts", label: "Parts Inventory & Vehicle Fitment", icon: Wrench },
          { key: "vehicles", label: "Makes, Models & Categories", icon: Layers },
          { key: "logs", label: "Stock Logs & Users", icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <motion.button
              key={tab.key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-300"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-red-400" : "text-slate-500"}`} />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab 2: Parts Tab */}
      {activeTab === "parts" && <AdminPartsTab />}

      {/* Tab 3: Vehicles & Categories Tab */}
      {activeTab === "vehicles" && <AdminMetaTab mode="vehicles" />}

      {/* Tab 4: Logs Tab */}
      {activeTab === "logs" && <AdminMetaTab mode="logs" />}

      {/* Tab 1: Executive Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {loading && !data ? (
            <div className="h-44 bg-white/90 border border-slate-200 rounded-3xl animate-pulse" />
          ) : (
            <>
              {/* Executive Metrics Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Sales Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 space-y-2 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
                      <DollarSign className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    ${metrics?.totalSales.toFixed(2) || "0.00"}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid revenue orders
                  </p>
                </motion.div>

                {/* Total Orders Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 space-y-2 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-xs">
                      <ShoppingCart className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {metrics?.totalOrders || 0}
                  </p>
                  <p className="text-[11px] text-amber-700 font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {metrics?.pendingOrders || 0} pending processing
                  </p>
                </motion.div>

                {/* Low Stock Alerts Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 space-y-2 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Low Stock</span>
                    <div className="w-9 h-9 rounded-xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shadow-xs">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-red-600">
                    {metrics?.lowStockCount || 0}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Parts below safety threshold
                  </p>
                </motion.div>

                {/* Customers Count Card */}
                <motion.div
                  whileHover={{ y: -6, scale: 1.015 }}
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-5 sm:p-6 space-y-2 shadow-xl shadow-slate-900/5 hover:shadow-2xl hover:border-slate-300 transition-all relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-slate-500">
                    <span className="text-xs font-bold uppercase tracking-wider">Total Customers</span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-600 shadow-xs">
                      <Users className="w-4 h-4" />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-black text-slate-900">
                    {metrics?.totalUsers || 0}
                  </p>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Active registered buyers
                  </p>
                </motion.div>
              </div>

              {/* Daily Sales Chart */}
              {data?.dailySales && data.dailySales.length > 0 && (
                <div className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-900/5">
                  <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-red-600" />
                        Daily Revenue &amp; Sales Velocity
                      </h2>
                      <p className="text-xs text-slate-500">
                        Finalized customer transactions volume
                      </p>
                    </div>
                  </div>

                  <div className="h-64 w-full pt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={data.dailySales}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#64748b" }} />
                        <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
                        <Tooltip
                          formatter={(val: unknown) => [
                            `$${Number(val || 0).toFixed(2)}`,
                            "Sales Volume",
                          ]}
                          contentStyle={{
                            backgroundColor: "#ffffff",
                            borderRadius: "16px",
                            border: "1px solid #e2e8f0",
                            boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar dataKey="sales" fill="#dc2626" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Low Stock Attention List */}
              <div className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-900/5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                      Critical Low Stock Alerts
                    </h2>
                    <p className="text-xs text-slate-500">
                      Spare parts requiring inventory re-order or restock
                    </p>
                  </div>
                </div>

                {data?.lowStockParts && data.lowStockParts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                          <th className="py-3 px-3">Part Name</th>
                          <th className="py-3 px-3">OEM / SKU</th>
                          <th className="py-3 px-3">Brand</th>
                          <th className="py-3 px-3">Stock Units</th>
                          <th className="py-3 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {data.lowStockParts.map((p) => (
                          <tr key={p._id} className="hover:bg-red-50/40 transition">
                            <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                            <td className="py-3 px-3 font-mono font-bold text-slate-600">
                              {p.partNumber}
                            </td>
                            <td className="py-3 px-3 text-slate-600">{p.brand}</td>
                            <td className="py-3 px-3">
                              <span className="font-extrabold text-red-700 bg-red-100/80 border border-red-200 px-2.5 py-0.5 rounded-full text-[11px]">
                                {p.stock} units remaining
                              </span>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <button
                                onClick={() => setRestockModalPart({ id: p._id, name: p.name })}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition shadow-xs"
                              >
                                Restock +
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-emerald-800 bg-emerald-50/60 border border-emerald-200 rounded-2xl">
                    <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                    All inventory levels are optimal above safety thresholds.
                  </div>
                )}
              </div>

              {/* Customer Orders Table */}
              <div className="bg-white/95 backdrop-blur-xl border border-slate-300 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl shadow-slate-900/5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <Package className="w-4 h-4 text-slate-700" />
                      Customer Orders Management ({allOrders.length})
                    </h2>
                    <p className="text-xs text-slate-500">
                      View details, update shipment stages, and print invoices
                    </p>
                  </div>

                  <select
                    value={orderFilter}
                    onChange={(e) => setOrderFilter(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    <option value="">All Statuses ({allOrders.length})</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {allOrders.length === 0 ? (
                  <p className="text-xs text-slate-500 py-8 text-center bg-slate-50 rounded-2xl">
                    No orders found matching this filter.
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                          <th className="py-3.5 px-4 font-bold">Order #</th>
                          <th className="py-3.5 px-4 font-bold">Customer &amp; Phone</th>
                          <th className="py-3.5 px-4 font-bold">Total Amount</th>
                          <th className="py-3.5 px-4 font-bold">Current Status</th>
                          <th className="py-3.5 px-4 font-bold">Update Status</th>
                          <th className="py-3.5 px-4 font-bold text-right">Invoice</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {allOrders.map((ord) => (
                          <tr key={ord._id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                              {ord.orderNumber}
                            </td>
                            <td className="py-3.5 px-4">
                              <p className="font-bold text-slate-900">{ord.shippingAddress.name}</p>
                              <p className="text-slate-400 text-[11px] font-mono mt-0.5">
                                {ord.shippingAddress.phone} &bull; {ord.shippingAddress.city}
                              </p>
                            </td>
                            <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                              ${ord.totalAmount.toFixed(2)}
                            </td>
                            <td className="py-3.5 px-4">
                              {getStatusBadge(ord.orderStatus)}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={ord.orderStatus}
                                onChange={(e) =>
                                  handleStatusChange(
                                    ord._id,
                                    e.target.value as OrderItem["orderStatus"]
                                  )
                                }
                                className="text-xs bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-semibold text-slate-800"
                              >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <Link
                                to={`/orders/${ord._id}`}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-slate-700 font-bold text-xs transition"
                              >
                                <Printer className="w-3.5 h-3.5 text-slate-500" />
                                <span>Invoice</span>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Restock Modal */}
      <AnimatePresence>
        {restockModalPart && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              className="bg-white rounded-3xl border border-slate-200 max-w-sm w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="text-sm font-bold text-slate-900">
                  Restock Inventory: &ldquo;{restockModalPart.name}&rdquo;
                </h3>
                <button
                  type="button"
                  onClick={() => setRestockModalPart(null)}
                  className="p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleRestockSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Add Quantity
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={restockQty}
                    onChange={(e) => setRestockQty(parseInt(e.target.value, 10) || 1)}
                    className="w-full text-sm border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setRestockModalPart(null)}
                    className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-red-500/25 transition-all"
                  >
                    Confirm Restock
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
