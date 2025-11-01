import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CartPage.css";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-page">
      <h2>My Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div>
                  <h4>{item.name}</h4>
                  <p>₹{item.price}</p>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => removeFromCart(item._id)}>Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="summary-section">
            <h3>Total: ₹{total}</h3>
            <button className="proceed-btn" onClick={() => navigate("/cart/address")}>
              Proceed to Address
            </button>
          </div>
        </>
      )}
    </div>
  );
}
