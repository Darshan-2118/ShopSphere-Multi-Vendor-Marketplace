import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      navigate("/products");
      return;
    }

    navigate(
      `/products?search=${encodeURIComponent(trimmedSearch)}`
    );
  };

  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const getCartCount = () => {
    try {
      const cart = JSON.parse(
        localStorage.getItem("cart") || "[]"
      );

      return cart.reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );
    } catch {
      return 0;
    }
  };

  const cartCount = getCartCount();

  return (
    <nav className="cart-navbar">
      {/* Logo */}
      <button
        className="cart-logo"
        type="button"
        onClick={() => navigate("/")}
      >
        ShopSphere
      </button>

      {/* Search */}
      <form
        className="cart-search"
        onSubmit={handleSearch}
      >
        <span className="cart-search-icon">⌕</span>

        <input
          type="text"
          placeholder="Search for products, brands, or sellers..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </form>

      {/* Navigation */}
      <div className="cart-nav-links">
        <button
          className={
            isActive("/")
              ? "cart-nav-active"
              : ""
          }
          type="button"
          onClick={() => navigate("/")}
        >
          <span className="nav-icon">⌂</span>
          <span>Home</span>
        </button>

        <button
          className={
            isActive("/products")
              ? "cart-nav-active"
              : ""
          }
          type="button"
          onClick={() => navigate("/products")}
        >
          <span className="nav-icon">▦</span>
          <span>Products</span>
        </button>

        <button
          className={
            isActive("/cart")
              ? "cart-nav-active"
              : ""
          }
          type="button"
          onClick={() => navigate("/cart")}
        >
          <span className="nav-cart-wrapper">
            <span className="nav-icon">🛒</span>

            {cartCount > 0 && (
              <span className="cart-count">
                {cartCount}
              </span>
            )}
          </span>

          <span>Cart</span>
        </button>

        <button
          className={
            isActive("/login")
              ? "cart-nav-active"
              : ""
          }
          type="button"
          onClick={() => navigate("/login")}
        >
          <span className="nav-icon">◎</span>
          <span>Account</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;