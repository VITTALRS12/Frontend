import React, { useState, useEffect } from "react";
import "./AdminContestManager.css";

const API = "http://localhost:5000";

function AdminContestManager() {
  const [contests, setContests] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
    status: "active",
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  const fetchContests = async () => {
    try {
      const [activeRes, completedRes] = await Promise.all([
        fetch(`${API}/api/contests/active`),
        fetch(`${API}/api/contests/completed`),
      ]);
      const active = await activeRes.json();
      const completed = await completedRes.json();
      setContests([...active, ...completed]);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchContests();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(
        editingId ? `${API}/api/contests/${editingId}` : `${API}/api/contests`,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage(editingId ? "Contest updated." : "Contest created.");
        setFormData({
          title: "",
          description: "",
          startDate: "",
          endDate: "",
          imageUrl: "",
          status: "active",
        });
        setEditingId(null);
        fetchContests();
      } else {
        setMessage(data.message || "Error saving contest.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error saving contest.");
    }
  };

  const handleEdit = (contest) => {
    setFormData({
      title: contest.title || "",
      description: contest.description || "",
      startDate: contest.startDate ? contest.startDate.slice(0, 10) : "",
      endDate: contest.endDate ? contest.endDate.slice(0, 10) : "",
      imageUrl: contest.imageUrl || "",
      status: contest.status || "active",
    });
    setEditingId(contest._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this contest?")) return;

    try {
      const res = await fetch(`${API}/api/contests/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Contest deleted.");
        fetchContests();
      } else {
        setMessage(data.message || "Error deleting contest.");
      }
    } catch (err) {
      console.error(err);
      setMessage("Error deleting contest.");
    }
  };

  return (
    <div className="admin-contest-manager">
      <h1>{editingId ? "Edit Contest" : "Create New Contest"}</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="imageUrl"
          placeholder="Image URL"
          value={formData.imageUrl}
          onChange={handleChange}
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit">
          {editingId ? "Update Contest" : "Create Contest"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>

      <h2>All Contests</h2>
      <div className="contest-list">
        {contests.map((contest) => (
          <div key={contest._id} className="contest-card">
            <div className="contest-info">
              <h3>{contest.title}</h3>
              <p>{contest.description}</p>
              {contest.imageUrl && (
                <img
                  src={contest.imageUrl}
                  alt={contest.title}
                  className="contest-image"
                />
              )}
              <small>
                {new Date(contest.startDate).toLocaleDateString()} –{" "}
                {new Date(contest.endDate).toLocaleDateString()} | Status:{" "}
                {contest.status}
              </small>
            </div>
            <div className="button-group">
              <button
                onClick={() => handleEdit(contest)}
                className="edit-button"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(contest._id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminContestManager;
