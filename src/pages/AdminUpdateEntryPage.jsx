import React, { useState } from "react";
import axios from "axios";
import "./AdminUpdateEntryPage.css";

function AdminUpdateEntryPage() {
  const [entryId, setEntryId] = useState("");
  const [status, setStatus] = useState("");
  const [prize, setPrize] = useState("");

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("You must be logged in as admin to update an entry.");
        return;
      }

      await axios.put(
        `http://localhost:5000/api/contest-entries/${entryId}/status`,
        { status, prize },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Entry updated successfully!");
      setEntryId("");
      setStatus("");
      setPrize("");
    } catch (err) {
      console.error("Error:", err.response || err);
      alert(
        err?.response?.data?.message ||
          "Failed to update entry. Check your token or permissions."
      );
    }
  };

  return (
    <div className="admin-update-container">
      <h1 className="admin-update-title">Update Entry Status</h1>

      <input
        className="admin-update-input"
        placeholder="Entry ID"
        value={entryId}
        onChange={(e) => setEntryId(e.target.value)}
      />

      <input
        className="admin-update-input"
        placeholder="Status (pending, winner, loser)"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      />

      <input
        className="admin-update-input"
        placeholder="Prize"
        value={prize}
        onChange={(e) => setPrize(e.target.value)}
      />

      <button className="admin-update-button" onClick={handleUpdate}>
        Update
      </button>
    </div>
  );
}

export default AdminUpdateEntryPage;
