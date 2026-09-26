import { useNavigate } from "react-router-dom";
import "../styles/footer.css";

function Footer() {
  const navigate = useNavigate();

  const handleCategory = (category) => {
    navigate(`/products?search=${encodeURIComponent(category)}`);
  };

  return (
    <footer
      className="home-footer"
      style={{
        backgroundColor: "#f4f1eb",
        color: "#171717",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <div className="footer-main">
        <div className="footer-brand">
          <div className="footer-logo">
            ShopSphere
          </div>

          <p>
            Your multi-vendor marketplace for discovering products you love.
          </p>
        </div>

        <div className="footer-column">
          <h4>Shop</h4>

          <button
            type="button"
            onClick={() => navigate("/products")}
          >
            All products
          </button>

          <button
            type="button"
            onClick={() => handleCategory("Fashion")}
          >
            Fashion
          </button>

          <button
            type="button"
            onClick={() => handleCategory("Electronics")}
          >
            Electronics
          </button>
        </div>

        <div className="footer-column">
          <h4>Account</h4>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>

          <button
            type="button"
            onClick={() => navigate("/register")}
          >
            Create account
          </button>

          <button
            type="button"
            onClick={() => navigate("/cart")}
          >
            Cart
          </button>
        </div>

        <div className="footer-column">
          <h4>ShopSphere</h4>

          <button type="button">
            About us
          </button>

          <button type="button">
            Contact
          </button>

          <button type="button">
            Help center
          </button>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 ShopSphere. All rights reserved.</p>

        <p>Built for a better way to shop.</p>
      </div>
    </footer>
  );
}

export default Footer;