import React from "react";
import { Routes, Route } from "react-router-dom";

// Shared Components
import Navbar from "./components/Navbar";
import ContestList from "./components/ContestList";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import MyEntries from "./components/MyEntries";
import Location from "./pages/Location";
import ErrorBoundary from "./components/ErrorBoundary";

// Public Pages
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SignupPage from "./pages/SignupPage";
import ResendOtp from "./pages/ResendOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminLogin from "./pages/AdminLogin";

// Cart Flow Pages
import CartPage from "./pages/CartPage";
import DeliveryAddress from "./pages/DeliveryAddress";
// import PaymentMethod from "./pages/PaymentMethod";
import CartCheckoutPage from "./pages/CartCheckoutPage";

// Shop Pages
import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import PaymentPage from "./pages/PaymentPage";

// User Private Pages
import ProfilePage from "./components/ProfilePage";
import WalletPage from "./pages/WalletPage";
import ReferralDashboard from "./pages/ReferralDashboard";
import MyOrdersPage from "./pages/MyOrdersPage";

// Admin Pages
import AdminPanel from "./pages/AdminPanel";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminOrdersPage from "./pages/AdminOrdersPage";
import AdminProductListPage from "./pages/AdminProductListPage";
import AdminProductCreatePage from "./pages/AdminProductCreatePage";
import AdminProductEditPage from "./pages/AdminProductEditPage";
import AdminUserManagementPage from "./pages/AdminUserManagementPage";
import AdminSettingsPage from "./pages/AdminSettingsPage";
import AdminUpdateEntryPage from "./pages/AdminUpdateEntryPage";
import AdminContestManager from "./components/AdminContestManager";

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <main className="min-h-screen pt-20 px-4 bg-gray-50">
        <Routes>

          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/resend-otp" element={<ResendOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/location" element={<Location />} />

          {/* Cart Flow */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/cart/address" element={<DeliveryAddress />} />
          {/* <Route path="/cart/payment" element={<PaymentMethod />} /> */}
          <Route
            path="/cart/checkout"
            element={
              <PrivateRoute>
                <CartCheckoutPage />
              </PrivateRoute>
            }
          />

          {/* Shop Pages */}
          <Route path="/shop" element={<ProductListPage />} />
          <Route path="/shop/products/:id" element={<ProductDetailPage />} />
          <Route path="/shop/checkout/:id" element={<PaymentPage />} />

          {/* User Private Routes */}
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/wallet"
            element={
              <PrivateRoute>
                <WalletPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/referral-dashboard"
            element={
              <PrivateRoute>
                <ReferralDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-entries"
            element={
              <PrivateRoute>
                <MyEntries />
              </PrivateRoute>
            }
          />
          <Route
            path="/my-orders"
            element={
              <PrivateRoute>
                <MyOrdersPage />
              </PrivateRoute>
            }
          />

          {/* Contest page protection */}
          <Route
            path="/contests"
            element={
              <PrivateRoute>
                <ContestList />
              </PrivateRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrdersPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminRoute>
                <AdminProductListPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/create"
            element={
              <AdminRoute>
                <AdminProductCreatePage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/products/:id/edit"
            element={
              <AdminRoute>
                <AdminProductEditPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUserManagementPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminRoute>
                <AdminSettingsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/contests"
            element={
              <AdminRoute>
                <AdminContestManager />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/update-entry"
            element={
              <AdminRoute>
                <AdminUpdateEntryPage />
              </AdminRoute>
            }
          />

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="text-center mt-10 text-xl">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </main>
    </ErrorBoundary>
  );
}

export default App;
