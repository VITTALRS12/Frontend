import React, { useState } from "react";
import AddressForm from "./AddressForm";
import "./AddressList.css";

const AddressList = ({ addresses = [], onDelete, onUpdate }) => {
  const [editingId, setEditingId] = useState(null);

  return (
    <div className="address-list">
      {addresses.length === 0 && <p>No addresses found.</p>}

      {addresses.map((address) => (
        <div key={address._id} className="address-card">
          {editingId === address._id ? (
            <AddressForm
              initialData={address}
              onSubmit={(data) => {
                onUpdate(address._id, data);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <>
              <p><strong>{address.name}</strong></p>
              <p>{address.addressLine1}, {address.addressLine2}</p>
              <p>{address.city}, {address.state} - {address.pincode}</p>
              <p>{address.country}</p>
              {address.isDefault && (
                <span className="default-badge">Default</span>
              )}
              <button onClick={() => setEditingId(address._id)}>Edit</button>
              <button onClick={() => onDelete(address._id)}>Delete</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default AddressList;
