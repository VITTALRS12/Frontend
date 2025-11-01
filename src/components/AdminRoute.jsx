// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Show loading while auth context is fetching user
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" />; // Redirect non-admins to home
  }

  return children; // Allow access to admin
};

export default AdminRoute;
