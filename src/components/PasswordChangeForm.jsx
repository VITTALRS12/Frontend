import React, { useState } from "react";
import { changePassword } from "../api/profileApi";
import "./PasswordChangeForm.css";

const PasswordChangeForm = () => {
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await changePassword(data);
      setMessage("Password changed successfully.");
      setData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Error changing password.");
    }
  };

  return (
    <>
   <div className="password-reminder-marquee">
  <div className="marquee-content">
    Please remember your current password........................................
  </div>
</div>


      {/* ✅ Password Change Form */}
      <form onSubmit={handleSubmit} className="password-form">
        <input
          type="password"
          placeholder="Current Password"
          value={data.currentPassword}
          onChange={(e) => setData({ ...data, currentPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="New Password"
          value={data.newPassword}
          onChange={(e) => setData({ ...data, newPassword: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={data.confirmPassword}
          onChange={(e) => setData({ ...data, confirmPassword: e.target.value })}
          required
        />
        <button type="submit">Change Password</button>
        {message && <p>{message}</p>}
      </form>
    </>
  );
};

export default PasswordChangeForm;
