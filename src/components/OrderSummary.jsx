import React from "react";
import { useCart } from "../context/CartContext";
import axios from "axios";
import toast from "react-hot-toast";
import "./OrderSummary.css";

export default function OrderSummary({ onBack }) {
  const { cart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Please login to continue.");
      return;
    }

    try {
      // 1️⃣ Initiate payment order from backend
      const { data: order } = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/payment/orders`,
        { amount: total * 100 }, // in paisa
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 2️⃣ Configure Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Your Store",
        description: "Cart Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3️⃣ Verify payment with backend
            await axios.post(
              `${import.meta.env.VITE_SERVER_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                cart, // optional for saving cart order
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            toast.success("✅ Payment successful!");
            clearCart();
            window.location.href = "/my-orders";
          } catch (verifyErr) {
            console.error(verifyErr);
            toast.error("❌ Payment verification failed.");
          }
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => toast("Payment cancelled."),
        },
      };

      // 4️⃣ Open Razorpay checkout
      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment Failed:", response.error);
        toast.error("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      console.error(err);
      toast.error("Payment initiation failed.");
    }
  };

  return (
    <div className="order-summary">
      <h3>Order Summary</h3>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        cart.map((item) => (
          <div key={item._id} className="order-item">
            <img src={item.image} alt={item.name} className="order-item-img" />
            <div className="order-item-details">
              <p className="item-name">{item.name}</p>
              {item.selectedSize && (
                <p className="item-size">Size: {item.selectedSize}</p>
              )}
              <p>Qty: {item.quantity}</p>
              <p>Price: ₹{item.price}</p>
              <p>Total: ₹{item.price * item.quantity}</p>
            </div>
          </div>
        ))
      )}

      <hr />
      <div className="order-total">
        <strong>Total:</strong> ₹{total}
      </div>

      <div className="order-buttons">
        <button className="back-btn" onClick={onBack}>Previous</button>
        <button
          className="continue-btn"
          onClick={handlePayment}
          disabled={cart.length === 0}
        >
          Continue to Payment
        </button>
      </div>
    </div>
  );
}
