import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AdminOrdersPage.css"; // Optional: Create CSS for styling

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/orders", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          status: statusFilter,
          search: searchTerm,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.orders);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination.total,
      }));
    } catch (err) {
      console.error("Error fetching orders", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.page, statusFilter, searchTerm]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `/api/orders/${id}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchOrders();
    } catch (err) {
      console.error("Error updating status", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) {
      console.error("Error deleting order", err);
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="admin-orders-container">
      <h2 className="admin-orders-title">Orders Management</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Search by customer name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <button onClick={() => setPagination((prev) => ({ ...prev, page: 1 }))}>
          Search
        </button>
      </div>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <>
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.userId?.name || "N/A"}</td>
                  <td>{order.userId?.email || "N/A"}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusUpdate(order._id, e.target.value)
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button onClick={() => setSelectedOrder(order)}>View</button>
                    <button onClick={() => handleDelete(order._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            <button
              disabled={pagination.page === 1}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page - 1 }))
              }
            >
              Previous
            </button>
            <span>
              Page {pagination.page} of {totalPages}
            </span>
            <button
              disabled={pagination.page === totalPages}
              onClick={() =>
                setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
              }
            >
              Next
            </button>
          </div>
        </>
      )}

      {selectedOrder && (
        <div className="order-modal">
          <div className="order-modal-content">
            <h3>Order Details</h3>
            <p><strong>ID:</strong> {selectedOrder._id}</p>
            <p><strong>Customer:</strong> {selectedOrder.userId?.name}</p>
            <p><strong>Email:</strong> {selectedOrder.userId?.email}</p>
            <p><strong>Status:</strong> {selectedOrder.status}</p>
            <h4>Items:</h4>
            <ul>
              {selectedOrder.products?.map((item, index) => (
                <li key={index}>
                  {item.productId?.name || "Product"} × {item.quantity}
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedOrder(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
