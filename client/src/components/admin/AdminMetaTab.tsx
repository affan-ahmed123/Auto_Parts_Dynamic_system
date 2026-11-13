import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Trash2,
  History,
  Users,
  Car,
  Layers,
  CheckCircle2,
  Clock,
  Shield,
} from "lucide-react";
import { getMakes, getModels, getCategories } from "../../services/vehicle.service";
import {
  createMake,
  deleteMake,
  createModel,
  deleteModel,
  createCategory,
  deleteCategory,
  getStockLogs,
  getUsers,
  StockLogEntry,
} from "../../services/admin.service";
import { VehicleMake, VehicleModelItem, CategoryItem } from "../../types/catalog";
import { User } from "../../types/auth";
import { useToast } from "../../context/ToastContext";

export const AdminMetaTab: React.FC<{ mode: "vehicles" | "logs" }> = ({ mode }) => {
  const { showToast } = useToast();

  const [makes, setMakes] = useState<VehicleMake[]>([]);
  const [models, setModels] = useState<VehicleModelItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [logs, setLogs] = useState<StockLogEntry[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Form inputs
  const [newMakeName, setNewMakeName] = useState("");
  const [modelMake, setModelMake] = useState("");
  const [modelName, setModelName] = useState("");
  const [yearFrom, setYearFrom] = useState("2015");
  const [yearTo, setYearTo] = useState("2025");
  const [catName, setCatName] = useState("");
  const [catDesc, setCatDesc] = useState("");

  const loadMeta = async () => {
    const [m, md, c] = await Promise.all([getMakes(), getModels(), getCategories()]);
    setMakes(m);
    setModels(md);
    setCategories(c);
    if (!modelMake && m.length > 0) setModelMake(m[0]._id);
  };

  const loadLogsAndUsers = async () => {
    const [l, u] = await Promise.all([getStockLogs(), getUsers()]);
    setLogs(l);
    setUsers(u);
  };

  useEffect(() => {
    if (mode === "vehicles") {
      void loadMeta();
    } else {
      void loadLogsAndUsers();
    }
  }, [mode]);

  const handleAddMake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMakeName.trim()) return;
    try {
      await createMake(newMakeName.trim());
      setNewMakeName("");
      showToast("Make added successfully");
      void loadMeta();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to add make", "error");
    }
  };

  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!modelMake || !modelName.trim()) return;
    try {
      await createModel(
        modelMake,
        modelName.trim(),
        parseInt(yearFrom, 10),
        parseInt(yearTo, 10)
      );
      setModelName("");
      showToast("Vehicle model added successfully");
      void loadMeta();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to add model", "error");
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;
    try {
      await createCategory(catName.trim(), catDesc.trim());
      setCatName("");
      setCatDesc("");
      showToast("Category added successfully");
      void loadMeta();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Failed to add category", "error");
    }
  };

  if (mode === "logs") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {/* Stock Movement Audit Log */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-red-600" />
                Automated Inventory Movement Audit Log
              </h2>
              <p className="text-xs text-slate-500">
                Immutable ledger of stock deductions, cancellations, and restocks
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">Part Details</th>
                  <th className="py-3 px-3">Quantity Delta</th>
                  <th className="py-3 px-3">Resulting Stock</th>
                  <th className="py-3 px-3">Event Reason</th>
                  <th className="py-3 px-3">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {log.part?.name || "Deactivated Item"}
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-block font-extrabold px-2.5 py-0.5 rounded-full text-xs ${
                          log.change > 0
                            ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                            : "bg-red-50 text-red-800 border border-red-200"
                        }`}
                      >
                        {log.change > 0 ? `+${log.change}` : log.change} units
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      {log.newStock}
                    </td>
                    <td className="py-3 px-3 capitalize font-semibold text-slate-700">
                      {log.reason.replace("_", " ")}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px]">{log.notes || "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Users List */}
        <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl shadow-slate-900/5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Registered Platform Users ({users.length})
              </h2>
              <p className="text-xs text-slate-500">
                Authenticated customer and administrative user directory
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">Full Name</th>
                  <th className="py-3 px-3">Email Address</th>
                  <th className="py-3 px-3">Role Tier</th>
                  <th className="py-3 px-3">Verification</th>
                  <th className="py-3 px-3">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id || (u as unknown as { _id: string })._id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-600 text-[11px]">{u.email}</td>
                    <td className="py-3 px-3 capitalize">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                          u.role === "admin"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {u.role === "admin" && <Shield className="w-3 h-3 text-red-600" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full text-[10px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-800 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full text-[10px]">
                          <Clock className="w-3 h-3 text-amber-600" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    );
  }

  // Vehicles & Categories mode
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 lg:grid-cols-2 gap-6"
    >
      {/* Makes & Models */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl shadow-slate-900/5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Car className="w-4 h-4 text-red-600" />
            Vehicle Makes &amp; Models Fitment Matrix
          </h2>
          <p className="text-xs text-slate-500">
            Define manufacturers and cascading vehicle models with year ranges
          </p>
        </div>

        {/* Add Make Form */}
        <form onSubmit={handleAddMake} className="flex gap-2">
          <input
            type="text"
            value={newMakeName}
            onChange={(e) => setNewMakeName(e.target.value)}
            placeholder="Add new car manufacturer (e.g. Mazda, Subaru)..."
            className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-slate-900"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
          >
            <Plus className="w-3.5 h-3.5" /> Add Make
          </button>
        </form>

        {/* Makes Chips */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Registered Makes ({makes.length}):
          </label>
          <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50/60 rounded-2xl border border-slate-200/80">
            {makes.map((m) => (
              <span
                key={m._id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-white text-slate-800 rounded-full text-xs font-semibold border border-slate-200 shadow-xs"
              >
                {m.name}
                <button
                  type="button"
                  onClick={() => deleteMake(m._id).then(loadMeta)}
                  className="text-slate-400 hover:text-red-600 ml-0.5"
                  title={`Delete ${m.name}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Add Model Form */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Add Model for Selected Make:
          </label>
          <form onSubmit={handleAddModel} className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <select
              value={modelMake}
              onChange={(e) => setModelMake(e.target.value)}
              className="text-xs border border-slate-300 rounded-xl px-2.5 py-2 bg-white font-medium"
            >
              {makes.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Model (e.g. CX-5)"
              className="text-xs border border-slate-300 rounded-xl px-2.5 py-2 font-medium"
            />
            <input
              type="number"
              value={yearFrom}
              onChange={(e) => setYearFrom(e.target.value)}
              placeholder="From"
              className="text-xs border border-slate-300 rounded-xl px-2 py-2"
            />
            <input
              type="number"
              value={yearTo}
              onChange={(e) => setYearTo(e.target.value)}
              placeholder="To"
              className="text-xs border border-slate-300 rounded-xl px-2 py-2"
            />
            <button
              type="submit"
              className="col-span-2 sm:col-span-1 px-3 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Add
            </button>
          </form>
        </div>

        {/* Models List */}
        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Models Directory ({models.length}):
          </label>
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 text-xs bg-slate-50/50 rounded-2xl border border-slate-200/80 p-2">
            {models.map((mod) => (
              <div key={mod._id} className="py-2 px-2 flex items-center justify-between hover:bg-white rounded-lg transition">
                <div>
                  <span className="font-bold text-slate-900">
                    {typeof mod.make === "object" ? mod.make.name : ""} {mod.name}
                  </span>
                  <span className="text-slate-500 font-mono ml-2 text-[11px]">
                    ({mod.yearFrom} &ndash; {mod.yearTo})
                  </span>
                </div>
                <button
                  onClick={() => deleteModel(mod._id).then(loadMeta)}
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete model"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl shadow-slate-900/5">
        <div className="border-b border-slate-100 pb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            Automobile Component Categories
          </h2>
          <p className="text-xs text-slate-500">
            Manage spare parts categories, departments &amp; descriptions
          </p>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="Category Name (e.g. Turbochargers)..."
              className="flex-1 text-xs border border-slate-300 rounded-xl px-3.5 py-2.5 focus:ring-1 focus:ring-slate-900"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition"
            >
              <Plus className="w-3.5 h-3.5" /> Add Category
            </button>
          </div>
          <input
            type="text"
            value={catDesc}
            onChange={(e) => setCatDesc(e.target.value)}
            placeholder="Brief description of this component family..."
            className="w-full text-xs border border-slate-300 rounded-xl px-3.5 py-2 focus:ring-1 focus:ring-slate-900"
          />
        </form>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
            Active Categories ({categories.length}):
          </label>
          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 text-xs bg-slate-50/50 rounded-2xl border border-slate-200/80 p-2">
            {categories.map((cat) => (
              <div key={cat._id} className="py-2.5 px-2 flex items-center justify-between hover:bg-white rounded-lg transition">
                <div>
                  <p className="font-bold text-slate-900">{cat.name}</p>
                  <p className="text-slate-500 text-[11px]">{cat.description}</p>
                </div>
                <button
                  onClick={() =>
                    deleteCategory(cat._id)
                      .then(loadMeta)
                      .catch((e: Error) => showToast(e.message, "error"))
                  }
                  className="text-slate-400 hover:text-red-600 p-1"
                  title="Delete category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
