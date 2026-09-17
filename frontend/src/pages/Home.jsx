import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";

function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

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

  const handleSearch = (e) => {
    e.preventDefault();

    const search = searchTerm.trim();

    if (search === "") {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(search)}`
    );
  };

  return (
    <div className="home-page">
      {/* Navbar */}
      <nav className="home-navbar">
        <button
          className="home-logo"
          type="button"
          onClick={() => navigate("/")}
        >
          ShopSphere
        </button>

        <form
          className="home-search"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(e.target.value)
            }
          />

          <button type="submit">
            Search
          </button>
        </form>

        <div className="home-nav-actions">
          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            🛒 Cart
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Account
          </button>
        </div>
      </nav>

      {/* Categories */}
      <div className="category-bar">
        <button type="button">All</button>
        <button type="button">Fashion</button>
        <button type="button">Electronics</button>
        <button type="button">Home</button>
        <button type="button">Beauty</button>
        <button type="button">Accessories</button>
      </div>

      {/* Hero */}
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-small-text">
            SHOPSPHERE MARKETPLACE
          </p>

          <h1>
            Discover products
            <br />
            you’ll love.
          </h1>

          <p>
            Shop from multiple sellers and discover
            everything you need in one place.
          </p>

          <button
            className="shop-now-button"
            type="button"
            onClick={() => navigate("/products")}
          >
            Shop now
          </button>
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="products-heading">
          <div>
            <p className="section-label">
              OUR PRODUCTS
            </p>

            <h2>
              Explore products
            </h2>
          </div>

          <button
            className="view-all-button"
            type="button"
            onClick={() => navigate("/products")}
          >
            View all
          </button>
        </div>

        {loading && (
          <p className="product-status">
            Loading products...
          </p>
        )}

        {!loading && message && (
          <p className="product-status">
            {message}
          </p>
        )}

        {!loading &&
          !message &&
          products.length === 0 && (
            <p className="product-status">
              No products available.
            </p>
          )}

        {!loading &&
          products.length > 0 && (
            <div className="products-grid">
              {products.slice(0, 8).map((product) => (
                <div
                  className="product-card"
                  key={product._id}
                >
                  <div className="product-image">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="no-image">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="product-info">
                    <p className="product-category">
                      {product.category}
                    </p>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-description">
                      {product.description}
                    </p>

                    <div className="product-bottom">
                      <span className="product-price">
                        ₹{product.price}
                      </span>

                      <span className="product-stock">
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of stock"}
                      </span>
                    </div>

                    <button
                      className="add-cart-button"
                      type="button"
                      disabled={product.stock <= 0}
                      onClick={() =>
                        navigate(
                          `/products/${product._id}`
                        )
                      }
                    >
                      {product.stock > 0
                        ? "View product"
                        : "Out of stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </section>

      {/* Footer */}
      <footer className="home-footer">
        <div className="footer-logo">
          ShopSphere
        </div>

        <p>
          Your multi-vendor marketplace.
        </p>

        <p className="footer-copy">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Home;