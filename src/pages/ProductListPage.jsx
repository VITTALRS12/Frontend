import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Rating from "../components/Rating";
import Layout from "../components/Layout";
import "./ProductListPage.css";

function ProductListPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("relevance");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 18;

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("/api/shop/products");
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("Failed to load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const brands = ["All", ...new Set(products.map((p) => p.brand).filter(Boolean))];
  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filtered = products
    .filter((p) => p.name?.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((p) => selectedBrand === "All" || p.brand === selectedBrand)
    .filter((p) => selectedCategory === "All" || p.category === selectedCategory)
    .sort((a, b) => {
      if (sortOrder === "priceAsc") return a.price - b.price;
      if (sortOrder === "priceDesc") return b.price - a.price;
      if (sortOrder === "rating") return b.rating - a.rating;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / productsPerPage);
  const currentProducts = filtered.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  return (
    <Layout>
      <div className="product-header">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
        />

        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          {brands.map((brand) => (
            <option key={brand}>{brand}</option>
          ))}
        </select>

        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="relevance">Relevance</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="product-grid">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          currentProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <img
                src={product.image || "/images/product-placeholder.png"}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/images/product-placeholder.png";
                }}
              />
              <h3>{product.name}</h3>
              <p>₹{product.price?.toLocaleString()}</p>
              <Rating value={product.rating} />
              <div className="card-actions">
                <Link to={`/shop/products/${product._id}`}>Details</Link>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
                <button onClick={() => navigate(`/shop/checkout/${product._id}`)}>Buy Now</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? "active" : ""}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </Layout>
  );
}

export default ProductListPage;
