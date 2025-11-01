import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminProductCreatePage.css";

const AdminProductCreatePage = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    sizes: "",
    image: "",
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/admin/products", {
      ...formData,
      sizes: formData.sizes.split(",").map((s) => s.trim()),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/admin/products");
  };

  return (
    <div className="create-product">
      <h2>Create Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="originalPrice" type="number" placeholder="Original Price" value={formData.originalPrice} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
        <input name="sizes" placeholder="Sizes (comma separated)" value={formData.sizes} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default AdminProductCreatePage;
