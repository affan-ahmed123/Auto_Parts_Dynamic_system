import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { GarageProvider } from "./context/GarageContext";
import { CartProvider } from "./context/CartContext";
import { ToastProvider } from "./context/ToastContext";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { ProtectedRoute, AdminRoute } from "./components/common/ProtectedRoute";

import { HomePage } from "./pages/HomePage";
import { CatalogPage } from "./pages/CatalogPage";
import { PartDetailPage } from "./pages/PartDetailPage";
import { CartPage } from "./pages/CartPage";
import { CheckoutPage } from "./pages/CheckoutPage";
import { OrdersPage } from "./pages/OrdersPage";
import { OrderDetailPage } from "./pages/OrderDetailPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { VerifyEmailPage } from "./pages/VerifyEmailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <GarageProvider>
          <CartProvider>
            <ToastProvider>
              <div className="min-h-screen bg-transparent text-slate-900 flex flex-col justify-between selection:bg-red-600 selection:text-white">
                <Navbar />

                <main className="flex-1 w-full">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/catalog" element={<CatalogPage />} />
                    <Route path="/parts/:idOrSlug" element={<PartDetailPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route
                      path="/orders"
                      element={
                        <ProtectedRoute>
                          <OrdersPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/orders/:id" element={<OrderDetailPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                  </Routes>
                </main>

                <Footer />
              </div>
            </ToastProvider>
          </CartProvider>
        </GarageProvider>
      </AuthProvider>
    </Router>
  );
}
