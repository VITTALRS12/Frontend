import React from 'react';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="text-center mt-20 text-red-600 font-semibold text-lg">
        Access denied: Not an admin.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">👑 Admin Panel</h1>

      <div className="space-y-4">
        <div>
          <span className="font-medium text-gray-600">Name:</span>{' '}
          <span className="text-gray-800">{user.name}</span>
        </div>

        <div>
          <span className="font-medium text-gray-600">Email:</span>{' '}
          <span className="text-gray-800">{user.email}</span>
        </div>

        <div>
          <span className="font-medium text-gray-600">Role:</span>{' '}
          <span className="text-green-700 font-semibold uppercase">{user.role}</span>
        </div>

        <div>
          <span className="font-medium text-gray-600">Joined:</span>{' '}
          <span className="text-gray-800">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        You have access to admin-only features and dashboards.
      </div>
    </div>
  );
};

export default AdminPanel;
