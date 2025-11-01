import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import "./ProductDetailPage.css";

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedSize, setSelectedSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/shop/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRelated = async () => {
      if (!product?.brand || !product?.category) return;
      try {
        const { data } = await axios.get("/api/shop/products");
        const filtered = data.filter(
          (p) =>
            p._id !== product._id &&
            p.brand === product.brand &&
            p.category === product.category
        );
        setRelatedProducts(filtered.slice(0, 6));
      } catch (err) {
        console.error("Failed to load related products");
      }
    };
    fetchRelated();
  }, [product]);

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      selectedSize: selectedSize || null,
    };
    addToCart(cartItem);
    navigate("/cart");
  };

  if (loading) return <div className="loader">Loading...</div>;
  if (error || !product) return <div className="error">{error}</div>;

  return (
    <div className="product-detail-page">
      <div className="product-detail-content">
        <div className="details-box">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price}</p>
          <p className="original-price">
            <strong>Original Price:</strong> ₹{product.originalPrice || "N/A"}
          </p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Category:</strong> {product.category}</p>

          {Array.isArray(product.sizes) && product.sizes.length > 0 && (
            <div className="size-select-box">
              <label><strong>Choose Size (Optional):</strong></label>
              <select value={selectedSize} onChange={(e) => setSelectedSize(e.target.value)}>
                <option value="">Select Size</option>
                {product.sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          )}

          <p className="desc">{product.description || "No description available."}</p>

          <button className="add-cart-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        </div>
        <img
          src={product.image || "/images/product-placeholder.png"}
          alt={product.name}
          className="main-product-image"
          onError={(e) => {
            e.target.src = "/images/product-placeholder.png";
          }}
        />
      </div>

      <div className="related-products-section">
        <h3>More from {product.brand} in {product.category}</h3>
        <div className="related-products-grid">
          {relatedProducts.length === 0 ? (
            <p>No related products found.</p>
          ) : (
            relatedProducts.map((rel) => (
              <Link
                key={rel._id}
                to={`/shop/products/${rel._id}`}
                className="related-product-card"
              >
                <img
                  src={rel.image || "/images/product-placeholder.png"}
                  alt={rel.name}
                  onError={(e) => {
                    e.target.src = "/images/product-placeholder.png";
                  }}
                />
                <div className="related-info">
                  <p>{rel.name}</p>
                  <p className="price">₹{rel.price}</p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailPage;
