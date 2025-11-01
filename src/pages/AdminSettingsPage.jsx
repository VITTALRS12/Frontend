import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: "", value: "" });
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const BASE_URL = "/api/admin/settings";

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSettings(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    if (!newSetting.key.trim()) {
      alert("Key is required");
      return;
    }
    try {
      await axios.post(
        BASE_URL,
        {
          key: newSetting.key.trim(),
          value: newSetting.value,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNewSetting({ key: "", value: "" });
      fetchSettings();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (key) => {
    if (!window.confirm(`Delete setting "${key}"?`)) return;
    try {
      await axios.delete(`${BASE_URL}/${key}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchSettings();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-4">Settings Management</h2>

      {error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {error}
        </div>
      )}

      {/* Add new setting */}
      <div className="bg-white shadow rounded p-4 mb-6">
        <h3 className="text-lg font-semibold mb-2">Create or Update Setting</h3>
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0">
          <input
            type="text"
            placeholder="Key"
            value={newSetting.key}
            onChange={(e) =>
              setNewSetting((prev) => ({ ...prev, key: e.target.value }))
            }
            className="border p-2 w-full md:w-1/3"
          />
          <input
            type="text"
            placeholder="Value"
            value={newSetting.value}
            onChange={(e) =>
              setNewSetting((prev) => ({ ...prev, value: e.target.value }))
            }
            className="border p-2 w-full md:w-1/3"
          />
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </div>

      {/* Settings list */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border px-4 py-2 text-left">Key</th>
              <th className="border px-4 py-2 text-left">Value</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td colSpan="3" className="text-center py-4">
                  No settings found.
                </td>
              </tr>
            ) : (
              settings.map((s) => (
                <tr key={s.key}>
                  <td className="border px-4 py-2">{s.key}</td>
                  <td className="border px-4 py-2">{s.value}</td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() =>
                        setNewSetting({ key: s.key, value: s.value })
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(s.key)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminSettingsPage;
