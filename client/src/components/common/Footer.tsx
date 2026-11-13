import React from "react";
import { Link, useLocation } from "react-router-dom";

export const Footer: React.FC = () => {
  const location = useLocation();

  // Hide the store footer completely on Admin pages (/admin)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-300 bg-white/90 backdrop-blur-2xl py-8 print:hidden text-xs text-slate-600 mt-12 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + AA Auto Parts */}
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="AA Auto Parts"
              className="h-9 w-auto object-contain drop-shadow-md"
            />
            <div>
              <span className="text-base font-black tracking-tight text-slate-900 block">
                AA Auto Parts
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Premium Automobile Spare Parts E-Commerce
              </span>
            </div>
          </div>

          {/* Proposed by Affan Ahmed badge (Clean, solid badge without blinking red dot) */}
          <div className="inline-flex items-center px-4 py-1.5 bg-slate-100/90 border border-slate-300 rounded-full text-slate-700 text-xs font-semibold shadow-xs">
            <span>Proposed by Affan Ahmed</span>
          </div>

          {/* Links & Support */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <Link to="/catalog" className="text-slate-700 hover:text-red-600 transition">
              Catalog
            </Link>
            <Link to="/orders" className="text-slate-700 hover:text-red-600 transition">
              Orders
            </Link>
            <a
              href="mailto:affan.codes01@gmail.com"
              className="text-red-700 hover:underline font-bold"
            >
              affan.codes01@gmail.com
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} AA Auto Parts &bull; All Rights Reserved. Engineered for 100% Fitment Compatibility.
          </p>
          <p className="text-slate-400">
            Designed &amp; Developed for Automobile Spare Parts
          </p>
        </div>
      </div>
    </footer>
  );
};
