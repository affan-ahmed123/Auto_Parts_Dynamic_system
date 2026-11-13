import React, { useState } from "react";
import { useSearchParams, useNavigate, useLocation, Link } from "react-router-dom";
import { MailCheck, KeyRound, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyEmail, resendCode } = useAuth();
  const { showToast } = useToast();

  const emailParam = searchParams.get("email") || "";
  const devCode = (location.state as { devCode?: string })?.devCode;

  const [email] = useState(emailParam);
  const [code, setCode] = useState(devCode || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !code || code.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await verifyEmail(email, code.trim());
      showToast("Email verified successfully! You can now sign in.");
      navigate("/login");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    setError(null);
    try {
      const res = await resendCode(email);
      showToast("New code sent to your email!");
      if (res.devCode) {
        setCode(res.devCode);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to resend code.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-2xl border border-white/70 rounded-3xl p-8 shadow-2xl shadow-black/20 ring-1 ring-white/50 text-center">
        <div className="inline-flex p-3 bg-slate-100 rounded-full text-slate-800 mb-4">
          <MailCheck className="w-8 h-8" />
        </div>

        <h1 className="text-2xl font-bold text-slate-900">Verify your email</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          We sent a 6-digit confirmation code to{" "}
          <strong className="text-slate-800">{email || "your email"}</strong>
        </p>

        {devCode && (
          <div className="mb-5 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 text-left">
            <p className="font-semibold mb-0.5">SMTP Notice (Dev Mode):</p>
            <p>
              Your Gmail SMTP settings are ready. While waiting for live email dispatch, your
              code is: <span className="font-mono font-bold text-sm tracking-widest">{devCode}</span>
            </p>
          </div>
        )}

        {error && (
          <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-xs text-red-700 text-left">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1 text-left">
              6-Digit Code
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                className="w-full text-center text-lg tracking-[8px] font-mono bg-white border border-slate-300 rounded-lg py-2.5 px-9 text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || code.length !== 6}
            className="w-full py-3 px-4 bg-slate-900 hover:bg-amber-600 disabled:opacity-40 text-white font-semibold rounded-xl text-sm shadow-md hover:shadow-lg transition-all"
          >
            {isSubmitting ? "Verifying..." : "Verify & Activate Account"}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleResend}
            disabled={isResending}
            className="text-slate-600 hover:text-slate-900 flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isResending ? "animate-spin" : ""}`} />
            Resend Code
          </button>
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

