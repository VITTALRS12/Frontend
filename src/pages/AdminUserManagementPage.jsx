import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminUserManagementPage.css";

const AdminUserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 10,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "" });

  const token = localStorage.getItem("token");
  const BASE_URL = "/api/admin/users";

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BASE_URL}?page=${pagination.page}&limit=${pagination.limit}&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUsers(data.users);
      setPagination((prev) => ({
        ...prev,
        total: data.pagination.total,
      }));
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, pagination.limit, search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleView = async (id) => {
    try {
      const { data } = await axios.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(data);
      setEditForm({ name: data.name || "", email: data.email || "" });
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${BASE_URL}/${selectedUser._id}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("User updated successfully.");
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      console.error(error.response?.data?.message || error.message);
    }
  };

  const totalPages = Math.max(1, Math.ceil(pagination.total / pagination.limit));

  return (
    <div className="admin-user-container">
      <h2>User Management</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by name..."
          className="user-search-input"
          value={search}
          onChange={(e) => {
            setPagination((prev) => ({ ...prev, page: 1 }));
            setSearch(e.target.value);
          }}
        />
      </div>

      {loading ? (
        <p className="loading-text">Loading...</p>
      ) : (
        <>
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="3" className="loading-text">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td className="actions-cell">
                      <button
                        className="action-button view-button"
                        onClick={() => handleView(user._id)}
                      >
                        View
                      </button>
                      <button
                        className="action-button delete-button"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="pagination-container">
            <button
              disabled={pagination.page <= 1}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page - 1,
                }))
              }
              className="pagination-button"
            >
              Prev
            </button>
            <span className="pagination-info">
              Page {pagination.page} of {totalPages}
            </span>
            <button
              disabled={pagination.page >= totalPages}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  page: prev.page + 1,
                }))
              }
              className="pagination-button"
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedUser && (
        <div className="edit-user-panel">
          <h3>Edit User</h3>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={editForm.name}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div>
            <label>Email:</label>
            <input
              type="email"
              value={editForm.email}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>
          <div className="edit-buttons">
            <button
              onClick={handleUpdate}
              className="action-button update-button"
            >
              Update
            </button>
            <button
              onClick={() => setSelectedUser(null)}
              className="action-button cancel-button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUserManagementPage;
