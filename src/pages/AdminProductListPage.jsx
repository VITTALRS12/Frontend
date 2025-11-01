import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FiEdit2, 
  FiTrash2, 
  FiPlus, 
  FiSearch, 
  FiChevronLeft, 
  FiChevronRight,
  FiFilter,
  FiRefreshCw
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "./AdminProductListPage.css";

const AdminProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    inStock: false,
    featured: false
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/products", {
        params: {
          page,
          limit,
          sort,
          order,
          search,
          filters: JSON.stringify(selectedFilters),
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products);
      setTotal(res.data.pagination.total);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  }, [page, search, sort, order, selectedFilters, token]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`/api/admin/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProducts(products.filter(p => p._id !== id));
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handleQuickEdit = (product) => {
    setSelectedProduct(product);
  };

  const saveQuickEdit = async () => {
    try {
      await axios.put(`/api/admin/products/${selectedProduct._id}`, selectedProduct, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const toggleFilter = (filter) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filter]: !prev[filter]
    }));
    setPage(1);
  };

  const resetFilters = () => {
    setSelectedFilters({
      inStock: false,
      featured: false
    });
    setSearch("");
    setPage(1);
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">Product Management</h1>
          <div className="header-actions">
            <button 
              className="btn-primary"
              onClick={() => navigate("/admin/products/create")}
            >
              <FiPlus className="icon" />
              Add Product
            </button>
          </div>
        </div>

        <div className="search-filter-bar">
          <div className="search-box">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="search-input"
            />
          </div>

          <div className="control-group">
            <div className="sort-control">
              <select 
                value={sort} 
                onChange={(e) => setSort(e.target.value)}
                className="select-control"
              >
                <option value="createdAt">Created At</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="sales">Popularity</option>
              </select>
              <select 
                value={order} 
                onChange={(e) => setOrder(e.target.value)}
                className="select-control"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <button 
              className="btn-filter"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <FiFilter className="icon" />
              Filters
            </button>

            <button 
              className="btn-secondary"
              onClick={fetchProducts}
            >
              <FiRefreshCw className={`icon ${loading ? "spin" : ""}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              className="filter-dropdown"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="filter-options">
                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFilters.inStock}
                    onChange={() => toggleFilter("inStock")}
                  />
                  <span>In Stock Only</span>
                </label>

                <label className="filter-checkbox">
                  <input
                    type="checkbox"
                    checked={selectedFilters.featured}
                    onChange={() => toggleFilter("featured")}
                  />
                  <span>Featured Products</span>
                </label>

                <button 
                  className="btn-text"
                  onClick={resetFilters}
                >
                  Reset Filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="dashboard-content">
        {loading ? (
          <div className="products-grid">
            {Array.from({ length: limit }).map((_, i) => (
              <div className="product-card-skeleton" key={i}>
                <Skeleton height={180} />
                <Skeleton count={3} />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <img src="/images/empty-products.svg" alt="No products" />
            <h3>No products found</h3>
            <p>Try adjusting your search or filters</p>
            <button 
              className="btn-primary"
              onClick={resetFilters}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="products-grid">
            <AnimatePresence initial={false}>
              {products.map((product) => (
                <motion.div
                  key={product._id}
                  className="product-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <div className="product-image-container">
                    <img 
                      src={product.image || "/images/product-placeholder.jpg"} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.src = "/images/product-placeholder.jpg";
                      }}
                    />
                    <div className="product-badge-group">
                      {product.featured && (
                        <span className="badge-featured">Featured</span>
                      )}
                      {product.stock > 0 ? (
                        <span className="badge-in-stock">In Stock</span>
                      ) : (
                        <span className="badge-out-of-stock">Out of Stock</span>
                      )}
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-brand">{product.brand}</p>
                    <div className="product-meta">
                      <span className="product-price">
                        {typeof product.price === "number"
                          ? `$${product.price.toFixed(2)}`
                          : "N/A"}
                      </span>
                      <span className="product-stock">{product.stock ?? 0} units</span>
                    </div>
                  </div>

                  <div className="product-actions">
                    <button 
                      className="btn-icon"
                      onClick={() => handleQuickEdit(product)}
                      aria-label="Quick edit"
                    >
                      <FiEdit2 />
                    </button>
                    <button 
                      className="btn-icon danger"
                      onClick={() => handleDelete(product._id)}
                      aria-label="Delete"
                    >
                      <FiTrash2 />
                    </button>
                    <button 
                      className="btn-text"
                      onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                    >
                      Full Edit
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {total > limit && (
          <div className="pagination">
            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <FiChevronLeft />
            </button>
            {Array.from({ length: Math.ceil(total / limit) }).map((_, i) => (
              <button
                key={i + 1}
                className={`pagination-btn ${page === i + 1 ? "active" : ""}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setPage(p => Math.min(Math.ceil(total / limit), p + 1))}
              disabled={page === Math.ceil(total / limit)}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div 
              className="modal-content"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Quick Edit: {selectedProduct.name}</h3>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  value={selectedProduct.price ?? 0}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    price: parseFloat(e.target.value) || 0
                  })}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  value={selectedProduct.stock ?? 0}
                  onChange={(e) => setSelectedProduct({
                    ...selectedProduct,
                    stock: parseInt(e.target.value) || 0
                  })}
                />
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={selectedProduct.featured}
                    onChange={(e) => setSelectedProduct({
                      ...selectedProduct,
                      featured: e.target.checked
                    })}
                  />
                  Featured Product
                </label>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn-secondary"
                  onClick={() => setSelectedProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  className="btn-primary"
                  onClick={saveQuickEdit}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProductListPage;
