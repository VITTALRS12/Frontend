import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import {
  FaUser,
  FaWallet,
  FaGift,
  FaTrophy,
  FaMapMarkerAlt,
  FaThLarge,
  FaSignOutAlt,
  FaShoppingCart,
  FaBox,
  FaPlusCircle,
  FaUsers,
  FaCogs,
  FaEdit,
  FaHome,
  FaBars,
} from "react-icons/fa";
import "./Navbar.css";

export default function Navbar() {
  const { user, token, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const handleLinkClick = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  const handleCartClick = () => {
    if (!token) {
      alert("Please login to view your cart.");
      navigate("/login");
    } else {
      navigate("/cart");
    }
  };

  return (
    <header>

      <div className="scroll-banner">
  <div className="scroll-content">
    🎯 <strong className="glow">Play Contest</strong> from 
    <span className="time-highlight"> 7 PM to 8 PM </span>
    and win <span className="gift-highlight">Exciting Gifts & Vouchers</span>! 🎁  
    <span className="cta-link" onClick={() => navigate("/")}>
      👉 Click Here to Participate
    </span>
  </div>
</div>


      {/* Banner */}
      <div className="sparkle-text">Welcome to ZooCart</div>

      {/* Navbar */}
      <nav className="nav-container">
        {/* Logo */}
        <span className="logo" onClick={() => navigate("/shop")}>
          ZooCart
        </span>

        <div className="nav-actions">
          {/* Shop */}
          <button
            onClick={() => navigate("/shop")}
            aria-label="Shop"
            className="nav-link-button"
          >
            <FaHome size={20} /> Shop
          </button>

          {/* Cart */}
          <button
            onClick={handleCartClick}
            aria-label="Cart"
            className="cart-button"
          >
            <FaShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="cart-count">{cartCount}</span>
            )}
          </button>

          {/* Auth */}
          {!token ? (
            <div className="auth-links">
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </div>
          ) : (
            <div className="user-menu">
              <span className="username">
                <FaUser /> {user?.name || "Account"}
              </span>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Menu"
                className="menu-button"
              >
                <FaBars size={22} />
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Dropdown */}
      {menuOpen && token && (
        <div className="menu-links animate-slide-down">
          {/* User */}
          <button onClick={() => handleLinkClick("/profile")}>
            <FaUser /> Profile
          </button>
          <button onClick={() => handleLinkClick("/")}>
            <FaUser /> Contest
          </button>
          <button onClick={() => handleLinkClick("/wallet")}>
            <FaWallet /> Wallet
          </button>
          <button onClick={() => handleLinkClick("/referral-dashboard")}>
            <FaGift /> Referrals
          </button>
          <button onClick={() => handleLinkClick("/my-entries")}>
            <FaTrophy /> My Score
          </button>
          <button onClick={() => handleLinkClick("/my-orders")}>
            <FaBox /> My Orders
          </button>
          <button onClick={() => handleLinkClick("/location")}>
            <FaMapMarkerAlt /> Location
          </button>
          <button onClick={handleCartClick}>
            <FaShoppingCart /> Cart
          </button>
          
          {/* Admin */}
          {user?.role === "admin" && (
            <>
              <button onClick={() => handleLinkClick("/admin/dashboard")}>
                <FaThLarge /> Admin Dashboard
              </button>
              <button onClick={() => handleLinkClick("/admin/orders")}>
                <FaShoppingCart /> Orders
              </button>
              <button onClick={() => handleLinkClick("/admin/products")}>
                <FaBox /> Products
              </button>
              <button onClick={() => handleLinkClick("/admin/products/create")}>
                <FaPlusCircle /> Create Product
              </button>
              <button onClick={() => handleLinkClick("/admin/users")}>
                <FaUsers /> Users
              </button>
              <button onClick={() => handleLinkClick("/admin/contests")}>
                <FaTrophy /> Contests
              </button>
              <button onClick={() => handleLinkClick("/admin/update-entry")}>
                <FaEdit /> Update Entry
              </button>
              <button onClick={() => handleLinkClick("/admin/settings")}>
                <FaCogs /> Settings
              </button>
            </>
          )}

          {/* Logout */}
          <button onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      )}
    </header>
  );
}
