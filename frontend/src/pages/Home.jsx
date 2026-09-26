import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

    if (!search) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(search)}`
    );
  };

  const handleCategory = (category) => {
    if (category === "All") {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(category)}`
    );
  };

  const categories = [
    {
      name: "Fashion",
      description: "Clothing & style",
      icon: "✦",
    },
    {
      name: "Electronics",
      description: "Tech & gadgets",
      icon: "⌁",
    },
    {
      name: "Home",
      description: "For your space",
      icon: "⌂",
    },
    {
      name: "Beauty",
      description: "Care & beauty",
      icon: "✧",
    },
    {
      name: "Accessories",
      description: "Complete your look",
      icon: "◇",
    },
  ];

  return (
    <div className="home-page">

      {/* Common Cart Navbar */}
      <Navbar />

      {/* Category Navigation */}
      <div className="category-bar">
        <button
          className="category-bar-item active"
          type="button"
          onClick={() => handleCategory("All")}
        >
          All
        </button>

        {categories.map((category) => (
          <button
            className="category-bar-item"
            type="button"
            key={category.name}
            onClick={() =>
              handleCategory(category.name)
            }
          >
            {category.name}
          </button>
        ))}
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
            you&apos;ll love.
          </h1>

          <p className="hero-description">
            Explore unique products from multiple sellers
            and find everything you need in one place.
          </p>

          <button
            className="shop-now-button"
            type="button"
            onClick={() => navigate("/products")}
          >
            Shop now
            <span>→</span>
          </button>
        </div>

        <div className="hero-visual">
          <div className="hero-circle hero-circle-one"></div>
          <div className="hero-circle hero-circle-two"></div>

          <div className="hero-card hero-card-main">
            <div className="hero-card-top">
              <span>SHOP</span>
              <span>01</span>
            </div>

            <div className="hero-card-center">
              <span className="hero-card-symbol">
                S
              </span>
            </div>

            <div className="hero-card-bottom">
              <span>DISCOVER</span>
              <span>MORE</span>
            </div>
          </div>

          <div className="hero-floating-card hero-floating-one">
            <span>NEW</span>
            <strong>ARRIVALS</strong>
          </div>

          <div className="hero-floating-card hero-floating-two">
            <span>✦</span>
            <strong>CURATED</strong>
          </div>
        </div>
      </section>

      {/* Shop By Category - ONLY CATEGORY SECTION */}
      <section className="categories-section">
        <div className="section-heading">
          <div>
            <p className="section-label">
              SHOP BY CATEGORY
            </p>

            <h2>Find what you need</h2>
          </div>

          <button
            className="section-link"
            type="button"
            onClick={() => navigate("/products")}
          >
            View all →
          </button>
        </div>

        <div className="category-cards">
          {categories.map((category) => (
            <button
              className="category-card"
              key={category.name}
              type="button"
              onClick={() =>
                handleCategory(category.name)
              }
            >
              <span className="category-icon">
                {category.icon}
              </span>

              <div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
              </div>

              <span className="category-arrow">
                ↗
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-label">
              OUR PRODUCTS
            </p>

            <h2>Explore products</h2>
          </div>

          <button
            className="section-link"
            type="button"
            onClick={() => navigate("/products")}
          >
            View all →
          </button>
        </div>

        {loading && (
          <div className="product-status">
            <div className="status-loader"></div>
            <p>Loading products...</p>
          </div>
        )}

        {!loading && message && (
          <div className="product-status">
            <p>{message}</p>
          </div>
        )}

        {!loading &&
          !message &&
          products.length === 0 && (
            <div className="product-status">
              <p>No products available.</p>
            </div>
          )}

        {!loading &&
          !message &&
          products.length > 0 && (
            <div className="products-grid">
              {products.slice(0, 8).map((product) => (
                <article
                  className="product-card"
                  key={product._id}
                >
                  <button
                    className="product-image"
                    type="button"
                    onClick={() =>
                      navigate(
                        `/products/${product._id}`
                      )
                    }
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                      />
                    ) : (
                      <div className="no-image">
                        <span>ShopSphere</span>
                      </div>
                    )}

                    <span className="product-view">
                      View →
                    </span>
                  </button>

                  <div className="product-info">
                    <p className="product-category">
                      {product.category ||
                        "Product"}
                    </p>

                    <h3>{product.name}</h3>

                    <div className="product-bottom">
                      <span className="product-price">
                        ₹{product.price}
                      </span>

                      <span
                        className={`product-stock ${
                          product.stock <= 0
                            ? "out"
                            : ""
                        }`}
                      >
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
                </article>
              ))}
            </div>
          )}
      </section>

      {/* Promotional Section */}
      <section className="home-promo">
        <div className="promo-content">
          <p className="promo-label">
            SHOPSPHERE EDIT
          </p>

          <h2>
            Something new
            <br />
            is waiting for you.
          </h2>

          <p>
            Browse our marketplace and discover products
            from sellers you&apos;ll love.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Explore marketplace
            <span>→</span>
          </button>
        </div>

        <div className="promo-shape">
          <div className="promo-shape-inner">
            <span>SS</span>
          </div>
        </div>
      </section>

     {/* Common Footer */}
      <Footer />

    </div>
  );
}

export default Home;