import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || "/";
  const isAdminPortal = from === "/admin" || location.search.includes("admin=true");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ email, password });
      showToast("Signed in successfully");
      navigate(from, { replace: true });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid email or password.";
      setError(msg);
      if (msg.toLowerCase().includes("not verified")) {
        // Redirect to verify if user tries to login without email code verification
        navigate(`/verify-email?email=${encodeURIComponent(email)}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-8 shadow-2xl shadow-black/20 ring-1 ring-white/50">
        <div className="text-center mb-5">
          <Link to="/" className="inline-flex flex-col items-center mb-2 group">
            <img src="/logo.png" alt="AA Auto Parts" className="h-14 w-auto mx-auto object-contain drop-shadow-xs group-hover:scale-105 transition-transform" />
            <span className="text-xl font-black text-slate-900 group-hover:text-red-600 transition-colors mt-1">AA Auto Parts</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Sign in</h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your garage, saved cart, and order history
          </p>
        </div>

        {/* Quick Admin Helper - Only visible when redirected from /admin */}
        {isAdminPortal && (
          <div className="mb-5 p-3 bg-red-50/90 border border-red-200 rounded-xl flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2 text-xs text-red-950 font-semibold">
              <Shield className="w-4 h-4 text-red-600 shrink-0" />
              <span>Administrator Portal Access</span>
            </div>
            <button
              type="button"
              onClick={() => {
                setEmail("affannadeem08@gmail.com");
                setPassword("admin123");
              }}
              className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold text-[11px] transition shadow-xs cursor-pointer"
            >
              Fill Admin Credentials
            </button>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full text-sm bg-white border border-slate-300 rounded-lg pl-9 pr-10 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-red-600 disabled:opacity-50 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-red-500/20 transition-all cursor-pointer"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600 mt-6">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};
