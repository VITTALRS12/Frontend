import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import "./AdminDashboardPage.css"; // Optional styling

const AdminDashboardPage = () => {
  const [metrics, setMetrics] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [orderAnalytics, setOrderAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [metricsRes, userRes, orderRes] = await Promise.all([
        axios.get("/api/admin/dashboard/metrics", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/dashboard/charts/user-growth", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("/api/admin/dashboard/charts/order-analytics", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      setMetrics(metricsRes.data);
      setUserGrowth(userRes.data);
      setOrderAnalytics(orderRes.data);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>

      <div className="metrics-grid">
        <div className="metric-card">
          <h3>Total Users</h3>
          <p className="metric-value">{metrics.totalUsers.value}</p>
          <p className="metric-description">{metrics.totalUsers.description}</p>
        </div>

        <div className="metric-card">
          <h3>Paid Users</h3>
          <p className="metric-value">{metrics.paidUsers.value}</p>
          <p className="metric-description">{metrics.paidUsers.ratio}</p>
        </div>

        <div className="metric-card">
          <h3>Active Contests</h3>
          <p className="metric-value">{metrics.activeContests.value}</p>
          <p className="metric-description">{metrics.activeContests.status}</p>
        </div>

        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p className="metric-value">
            {metrics.totalRevenue.currency}
            {metrics.totalRevenue.value.toLocaleString()}
          </p>
          <p className="metric-description">{metrics.totalRevenue.period}</p>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h3>User Growth (Monthly)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Orders Per Month</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={orderAnalytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="orders" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
