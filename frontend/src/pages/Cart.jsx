import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

function Cart() {
  const navigate = useNavigate();

  return (
    <div className="cart-page">
      {/* Navbar */}
      <nav className="cart-navbar">
        <button
          className="cart-logo"
          type="button"
          onClick={() => navigate("/")}
        >
          ShopSphere
        </button>

        <div className="cart-nav-links">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Products
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Account
          </button>
        </div>
      </nav>

      {/* Cart Header */}
      <section className="cart-header">
        <p className="cart-label">
          SHOPSPHERE
        </p>

        <h1>Your Cart</h1>

        <p>
          Review your items before checkout.
        </p>
      </section>

      {/* Empty Cart */}
      <main className="cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            🛒
          </div>

          <h2>
            Your cart is empty
          </h2>

          <p>
            You haven't added any products
            to your cart yet.
          </p>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            Continue shopping
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="cart-footer">
        <div className="cart-footer-logo">
          ShopSphere
        </div>

        <p>
          Your multi-vendor marketplace.
        </p>

        <p className="cart-footer-copy">
          © 2026 ShopSphere. All rights reserved.
        </p>
      </footer>
    </div>
  );
}

export default Cart;