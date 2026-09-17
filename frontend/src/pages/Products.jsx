import { useEffect, useState } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import "../styles/products.css";

function Products() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] =
    useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const searchTerm =
    searchParams.get("search") || "";

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchProducts = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to load products."
        );
        return;
      }

      setProducts(data.products || []);
    } catch (error) {
      console.error("Product fetch error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let result = [...products];

    if (searchTerm.trim() !== "") {
      const search = searchTerm.toLowerCase();

      result = result.filter((product) => {
        return (
          product.name
            ?.toLowerCase()
            .includes(search) ||
          product.description
            ?.toLowerCase()
            .includes(search) ||
          product.category
            ?.toLowerCase()
            .includes(search)
        );
      });
    }

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          product.category?.toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    setFilteredProducts(result);
  };

  const categories = [
    "All",
    "Fashion",
    "Electronics",
    "Home",
    "Beauty",
    "Accessories",
  ];

  return (
    <div className="products-page">
      {/* Navbar */}
      <nav className="products-navbar">
        <button
          className="products-logo"
          type="button"
          onClick={() => navigate("/")}
        >
          ShopSphere
        </button>

        <div className="products-nav-links">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            className="active"
            type="button"
          >
            Products
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>

        <button
          className="products-cart-button"
          type="button"
          onClick={() => navigate("/cart")}
        >
          🛒 Cart
        </button>
      </nav>

      {/* Header */}
      <section className="products-header">
        <p className="products-label">
          SHOPSPHERE MARKETPLACE
        </p>

        <h1>
          {searchTerm
            ? "Search results"
            : "All Products"}
        </h1>

        <p>
          {searchTerm
            ? `Products matching "${searchTerm}"`
            : "Discover products from our marketplace."}
        </p>
      </section>

      {/* Category Filters */}
      <section className="products-filter-section">
        <div className="products-categories">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={
                selectedCategory === category
                  ? "category-active"
                  : ""
              }
              onClick={() =>
                setSelectedCategory(category)
              }
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-list-section">
        {loading && (
          <p className="products-status">
            Loading products...
          </p>
        )}

        {!loading && message && (
          <p className="products-status">
            {message}
          </p>
        )}

        {!loading &&
          !message &&
          filteredProducts.length === 0 && (
            <p className="products-status">
              No products found.
            </p>
          )}

        {!loading &&
          !message &&
          filteredProducts.length > 0 && (
            <>
              <p className="products-result-count">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1
                  ? "s"
                  : ""}
              </p>

              <div className="products-list-grid">
                {filteredProducts.map((product) => (
                  <div
                    className="products-list-card"
                    key={product._id}
                  >
                    <div className="products-list-image">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                        />
                      ) : (
                        <div className="products-no-image">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="products-list-info">
                      <p className="products-list-category">
                        {product.category}
                      </p>

                      <h2>
                        {product.name}
                      </h2>

                      <p className="products-list-description">
                        {product.description}
                      </p>

                      <div className="products-list-bottom">
                        <span className="products-list-price">
                          ₹{product.price}
                        </span>

                        <span className="products-list-stock">
                          {product.stock > 0
                            ? `${product.stock} available`
                            : "Out of stock"}
                        </span>
                      </div>

                      <button
                        className="products-view-button"
                        type="button"
                        onClick={() =>
                          navigate(
                            `/products/${product._id}`
                          )
                        }
                      >
                        View product
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
      </section>

      {/* Footer */}
      <footer className="products-footer">
        <div className="products-footer-logo">
          ShopSphere
        </div>

        <p>
          Your multi-vendor marketplace.
        </p>

        <p className="products-footer-copy">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Products;