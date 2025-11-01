// src/pages/DeliveryAddress.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryAddress.css";
import OrderSummary from "../components/OrderSummary";

export default function DeliveryAddress() {
  const navigate = useNavigate();
  const [showSummary, setShowSummary] = useState(false);

  // Default saved address
  const [savedAddress, setSavedAddress] = useState({
    fullName: "Vittal Siddangar",
    phone: "9876543210",
    street: "123, MG Road",
    city: "Hyderabad",
    state: "Telangana",
    pincode: "500001",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(savedAddress);

  useEffect(() => {
    setFormData(savedAddress); // Sync saved address into form
  }, [savedAddress]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (Object.values(formData).some((val) => !val.trim())) {
      alert("Please fill all address fields.");
      return;
    }
    setSavedAddress(formData);
    setIsEditing(false);
  };

  const handleContinue = () => {
    setShowSummary(true);
  };

  const handleProceedToPayment = () => {
    navigate("/cart/payment");
  };

  return (
    <div className="address-page">
      <h2>Delivery Address</h2>

      {!isEditing && !showSummary && (
        <div className="address-card">
          <p><strong>Name:</strong> {savedAddress.fullName}</p>
          <p><strong>Phone:</strong> {savedAddress.phone}</p>
          <p><strong>Address:</strong> {savedAddress.street}, {savedAddress.city}, {savedAddress.state} - {savedAddress.pincode}</p>
          <div className="address-actions">
            <button onClick={() => setIsEditing(true)}>Edit Address</button>
            <button className="continue-btn" onClick={handleContinue}>
              Deliver to this address
            </button>
          </div>
        </div>
      )}

      {isEditing && (
        <form className="address-form">
          <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
          <input name="street" placeholder="Street Address" value={formData.street} onChange={handleChange} />
          <input name="city" placeholder="City" value={formData.city} onChange={handleChange} />
          <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
          <input name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} />
          <div className="address-actions">
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </form>
      )}

      {showSummary && (
        <OrderSummary
          onContinue={handleProceedToPayment}
          onBack={() => navigate("/cart")} // 👈 Navigates back to cart page
        />
      )}
    </div>
  );
}
