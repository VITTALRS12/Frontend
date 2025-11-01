import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./MyOrdersPage.css";

export default function MyOrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        return;
      }

      const res = await axios.get("/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!Array.isArray(res.data.orders)) {
        throw new Error("Invalid response format: expected orders array");
      }

      setOrders(res.data.orders);
    } catch (err) {
      console.error("Fetch orders error:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusLabel = (status) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return "📦 Shipped";
      case "delivered":
        return "✅ Delivered";
      case "cancelled":
        return "❌ Cancelled";
      case "processing":
        return "🕒 Processing";
      case "pending":
        return "🕒 Pending";
      default:
        return status;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-loading">Loading your orders...</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  return (
    <div className="orders-container">
      <h1 className="orders-title">
        {user?.name ? `${user.name}'s Orders` : "Your Orders"}
      </h1>
      <p className="orders-subtitle">Here are all your recent purchases.</p>

      {orders.length === 0 ? (
        <div className="orders-empty">You have no orders yet.</div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <p className="order-id">
                    Order ID: <span>{order._id}</span>
                  </p>
                  <p className="order-customer">
                    Name: <span>{user?.name || "N/A"}</span>
                  </p>
                  <p className="order-date">
                    Date:{" "}
                    <span>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </p>
                  <p className={`order-status ${order.status.toLowerCase()}`}>
                    Status: {getStatusLabel(order.status)}
                  </p>
                </div>
                <div className="order-total">
                  ₹{order.totalAmount?.toLocaleString() || "0"}
                </div>
              </div>
              <ul className="order-items">
                {order.products?.map((item, index) => (
                  <li key={index} className="order-item">
                    <span>{item.productId?.name || "Product"}</span>
                    <span>× {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
