import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut,
  Menu,
  X,
  Car,
  ShoppingCart,
  Package,
  Search,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useGarage } from "../../hooks/useGarage";
import { useCart } from "../../hooks/useCart";

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { vehicle, clearVehicle } = useGarage();
  const { itemCount } = useCart();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // On Admin pages, do not render the customer store navbar (Admin has its own dedicated operations bar)
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-2 sm:top-3 z-50 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full print:hidden"
    >
      {/* Floating Ultra-Sleek Glassmorphic Navbar Container with Colored Accents */}
      <div className="bg-white/95 backdrop-blur-xl border border-slate-300 shadow-xl shadow-red-500/5 hover:border-slate-400 rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-6 transition-all duration-300 hover:shadow-2xl">
        {/* Brand Logo with Smooth Bounce Effect */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group py-0.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className="flex items-center gap-2.5"
          >
            <img
              src="/logo.png"
              alt="AA Auto Parts"
              className="h-9 sm:h-11 w-auto object-contain drop-shadow-md group-hover:drop-shadow-red-500/40 transition-all"
            />
            <div className="flex flex-col">
              <span className="text-base sm:text-lg font-black tracking-tight leading-none">
                <span className="text-red-600">AA</span>{" "}
                <span className="text-slate-900 group-hover:text-red-600 transition-colors">Auto Parts</span>
              </span>
              <span className="text-[9px] font-extrabold text-red-700/80 uppercase tracking-widest mt-0.5 hidden sm:block">
                Genuine Auto Spares
              </span>
            </div>
          </motion.div>
        </Link>

        {/* Quick Search Bar (Desktop) with Colored Highlights */}
        <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-md relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by part name, brand, or OEM number..."
            className="w-full text-xs sm:text-sm bg-slate-50/80 hover:bg-white focus:bg-white backdrop-blur-md border border-slate-300 focus:border-red-500 rounded-full pl-9 pr-4 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all shadow-inner"
          />
          <Search className="w-4 h-4 text-red-500 absolute left-3 top-1/2 -translate-y-1/2" />
        </form>

        {/* Desktop Links, Garage & Cart with Enhanced Colors */}
        <nav className="hidden md:flex items-center gap-3 sm:gap-4">
          <Link
            to="/catalog"
            className="text-xs sm:text-sm font-bold text-slate-800 hover:text-red-600 hover:bg-red-50/70 transition-all px-3 py-1.5 rounded-full inline-block"
          >
            Catalog
          </Link>

          {/* My Garage Badge */}
          {vehicle ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50/95 backdrop-blur-md border border-emerald-300 text-emerald-900 rounded-full text-xs shadow-xs font-bold"
            >
              <Car className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <Link
                to={`/catalog?make=${vehicle.make}&model=${vehicle.model}&year=${vehicle.year}`}
                className="hover:underline truncate max-w-[130px]"
                title={`${vehicle.year} ${vehicle.makeName} ${vehicle.modelName}`}
              >
                {vehicle.year} {vehicle.modelName}
              </Link>
              <button
                onClick={clearVehicle}
                title="Clear garage vehicle"
                className="text-emerald-700 hover:text-red-600 ml-0.5 p-0.5 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </motion.div>
          ) : (
            <Link
              to="/catalog"
              className="flex items-center gap-1.5 px-3 py-1 bg-red-50/80 hover:bg-red-100/90 border border-red-200/80 text-red-700 rounded-full text-xs font-bold transition shadow-2xs"
            >
              <Car className="w-3.5 h-3.5 text-red-600" />
              <span>Add Vehicle</span>
            </Link>
          )}

          {/* Shopping Cart Pill Button with Animated Counter */}
          <Link to="/cart">
            <motion.div
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="relative p-2 bg-slate-100/90 hover:bg-red-50 border border-slate-300 hover:border-slate-400 rounded-full text-slate-800 hover:text-red-600 transition shadow-2xs"
              title="Shopping Cart"
            >
              <ShoppingCart className="w-4 h-4" />
              {itemCount > 0 && (
                <motion.span
                  key={itemCount}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 25 }}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md shadow-red-500/40"
                >
                  {itemCount}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* User Controls */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300">
              <Link
                to="/orders"
                className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-full transition"
                title="My Orders"
              >
                <Package className="w-4 h-4" />
              </Link>

              <Link
                to="/profile"
                className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 transition shadow-xs"
              >
                {user.name.split(" ")[0]}
              </Link>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-300">
              <Link
                to="/login"
                className="text-xs font-bold px-3.5 py-1.5 text-slate-800 hover:text-red-600 hover:bg-red-50 rounded-full transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-extrabold px-4 py-1.5 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-600 text-white rounded-full shadow-md shadow-red-600/30 transition-all hover:scale-105 transform"
              >
                Register
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile Header Controls */}
        <div className="md:hidden flex items-center gap-2">
          <Link to="/cart" className="relative p-2 text-slate-700">
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-full text-slate-600 hover:bg-white/80 transition"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Animated Floating Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-2 bg-white/95 backdrop-blur-2xl border border-slate-300 rounded-3xl p-4 shadow-2xl shadow-black/20 space-y-3"
          >
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search part or OEM SKU..."
                className="w-full text-xs bg-slate-100 border border-slate-300 rounded-full pl-9 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </form>

            {vehicle && (
              <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs">
                <div className="flex items-center gap-2 text-emerald-900 font-semibold">
                  <Car className="w-4 h-4 text-emerald-600" />
                  <span>
                    {vehicle.year} {vehicle.makeName} {vehicle.modelName}
                  </span>
                </div>
                <button
                  onClick={clearVehicle}
                  className="text-xs text-red-600 font-semibold hover:underline"
                >
                  Clear
                </button>
              </div>
            )}

            <div className="space-y-1">
              <Link
                to="/catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Browse Catalog
              </Link>

              {isAuthenticated && user ? (
                <>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    My Orders
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Profile ({user.name})
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-full text-xs font-bold text-center border border-slate-300 text-slate-800 hover:text-red-600 hover:bg-red-50 transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="px-3 py-2 rounded-full text-xs font-bold text-center bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-md shadow-red-600/30 transition"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
