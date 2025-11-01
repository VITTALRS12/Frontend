import React, { useState } from "react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";

function AdminCreateProduct() {
  const { token } = useAuth();
  const [form, setForm] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    sizes: "",
    image: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/admin/products",
        {
          ...form,
          sizes: form.sizes.split(",").map((s) => s.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product created!");
    } catch {
      toast.error("Failed to create product");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {Object.keys(form).map((key) => (
        <input
          key={key}
          placeholder={key}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
          className="border p-2 w-full"
        />
      ))}
      <button className="bg-blue-500 text-white px-4 py-2 rounded">
        Create Product
      </button>
    </form>
  );
}

export default AdminCreateProduct;
