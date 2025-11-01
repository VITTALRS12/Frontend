import React, { useState } from "react";
import "./AddressForm.css";

const AddressForm = ({ onAdd, initialData = {}, onSubmit, onCancel }) => {
  const [data, setData] = useState({
    name: initialData.name || "",
    addressLine1: initialData.addressLine1 || "",
    addressLine2: initialData.addressLine2 || "",
    city: initialData.city || "",
    state: initialData.state || "",
    pincode: initialData.pincode || "",
    country: initialData.country || "",
    isDefault: initialData.isDefault || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onAdd) onAdd(data);
    if (onSubmit) onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <input
        type="text"
        placeholder="Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Address Line 1"
        value={data.addressLine1}
        onChange={(e) => setData({ ...data, addressLine1: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Address Line 2"
        value={data.addressLine2}
        onChange={(e) => setData({ ...data, addressLine2: e.target.value })}
      />
      <input
        type="text"
        placeholder="City"
        value={data.city}
        onChange={(e) => setData({ ...data, city: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="State"
        value={data.state}
        onChange={(e) => setData({ ...data, state: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Pincode"
        value={data.pincode}
        onChange={(e) => setData({ ...data, pincode: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Country"
        value={data.country}
        onChange={(e) => setData({ ...data, country: e.target.value })}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={data.isDefault}
          onChange={(e) => setData({ ...data, isDefault: e.target.checked })}
        />
        Set as default
      </label>
      <button type="submit">{onAdd ? "Add Address" : "Save"}</button>
      {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
    </form>
  );
};

export default AddressForm;
