import React from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

function CartCheckoutPage() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handlePayment = () => {
    const options = {
      key: "rzp_test_qbgkPiwiDxV3dW", // replace with your Razorpay key
      amount: total * 100, // in paisa
      currency: "INR",
      name: "MyShop",
      description: "Purchase",
      handler: function (response) {
        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        clearCart();
        navigate("/my-orders");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600">
          Your cart is empty.{" "}
          <Link to="/shop" className="text-blue-600 hover:underline">
            Browse products
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Cart Checkout</h1>

      <ul className="mb-4">
        {cart.map((item) => (
          <li key={item._id} className="flex justify-between mb-2">
            <span>
              {item.name} × {item.quantity || 1}
            </span>
            <span>
              ₹{(item.price * (item.quantity || 1)).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>

      <div className="text-right text-lg font-bold mb-6">
        Total Amount: ₹{total.toLocaleString()}
      </div>

      <button
        onClick={handlePayment}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Pay Now
      </button>
    </div>
  );
}

export default CartCheckoutPage;
