import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";

export const AdminLoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();

  // Strictly enforce empty fields on mount (prevent browser autofill retention)
  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError("Please manually enter both your administrator email and master password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email: trimmedEmail, password });
      showToast("Administrator authenticated successfully", "success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid administrator credentials.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full bg-white/95 backdrop-blur-2xl border border-slate-300 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-slate-900/10 relative overflow-hidden"
      >
        {/* Subtle decorative top glow */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-rose-500 to-red-700" />

        {/* Top Header */}
        <div className="text-center mb-7 pt-2">
          <Link to="/" className="inline-flex flex-col items-center mb-3 group">
            <motion.img
              whileHover={{ scale: 1.05 }}
              src="/logo.png"
              alt="AA Auto Parts"
              className="h-16 w-auto object-contain drop-shadow-md"
            />
            <div className="flex items-center gap-2 mt-2.5">
              <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-red-600 transition-colors">
                AA Auto Parts
              </span>
              <span className="bg-red-50 text-red-700 border border-red-300 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                ADMIN ACCESS
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Administrator Portal
          </h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Enter the master credentials configured in your environment (<code className="text-slate-700 font-mono font-semibold">.env</code>) to access the operations hub.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 p-3.5 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-2.5 text-xs text-red-700"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </motion.div>
        )}

        {/* Manual Credentials Entry Form (No browser autofill / purely empty manual entry) */}
        <form
          onSubmit={handleSubmit}
          autoComplete="off"
          noValidate
          className="space-y-4"
        >
          {/* Hidden inputs to capture aggressive browser password managers */}
          <input
            type="text"
            name="prevent_browser_autofill_usr"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          <input
            type="password"
            name="prevent_browser_autofill_pwd"
            tabIndex={-1}
            autoComplete="new-password"
            className="hidden"
            aria-hidden="true"
          />

          <div>
            <label
              htmlFor="admin_login_email"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Administrator Email
            </label>
            <div className="relative">
              <input
                id="admin_login_email"
                name="admin_master_identity"
                type="email"
                required
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter administrator email"
                className="w-full text-xs sm:text-sm border border-slate-300 hover:border-slate-400 rounded-xl pl-9 pr-3.5 py-2.5 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition shadow-inner"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <label
              htmlFor="admin_login_password"
              className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider"
            >
              Master Password
            </label>
            <div className="relative">
              <input
                id="admin_login_password"
                name="admin_master_credential"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full text-xs sm:text-sm border border-slate-300 hover:border-slate-400 rounded-xl pl-9 pr-10 py-2.5 text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition shadow-inner"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25 transition-all cursor-pointer disabled:opacity-50 mt-3"
          >
            <ShieldCheck className="w-4 h-4 text-red-400 group-hover:text-white" />
            <span>{isSubmitting ? "Authenticating..." : "Sign In to Admin Hub"}</span>
          </motion.button>
        </form>

        {/* Back Link to Public Store */}
        <div className="pt-6 border-t border-slate-300 text-center mt-6">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-600 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store Front</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
