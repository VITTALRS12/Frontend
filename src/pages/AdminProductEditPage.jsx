import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./AdminProductEditPage.css";

const AdminProductEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    brand: "",
    sizes: "",
    image: "",
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const res = await axios.get(`/api/admin/products`, {
        params: {
          filters: JSON.stringify({ _id: id }),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      const p = res.data.products[0];
      if (p) {
        setFormData({
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          category: p.category,
          brand: p.brand,
          sizes: p.sizes.join(","),
          image: p.image,
        });
      }
    };
    fetchProduct();
  }, [id, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`/api/admin/products/${id}`, {
      ...formData,
      sizes: formData.sizes.split(",").map((s) => s.trim()),
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    navigate("/admin/products");
  };

  return (
    <div className="edit-product">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
        <input name="price" type="number" placeholder="Price" value={formData.price} onChange={handleChange} required />
        <input name="originalPrice" type="number" placeholder="Original Price" value={formData.originalPrice} onChange={handleChange} />
        <input name="category" placeholder="Category" value={formData.category} onChange={handleChange} />
        <input name="brand" placeholder="Brand" value={formData.brand} onChange={handleChange} />
        <input name="sizes" placeholder="Sizes (comma separated)" value={formData.sizes} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default AdminProductEditPage;
