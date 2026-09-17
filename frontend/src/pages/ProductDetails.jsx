import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/product-details.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/products/${id}`
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load product.");
        return;
      }

      setProduct(data);
    } catch (error) {
      console.error("Product details error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <p className="product-details-status">
          Loading product...
        </p>
      </div>
    );
  }

  if (message) {
    return (
      <div className="product-details-page">
        <p className="product-details-status">
          {message}
        </p>

        <button
          className="back-products-button"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <p className="product-details-status">
          Product not found.
        </p>

        <button
          className="back-products-button"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>
      </div>
    );
  }

  return (
    <div className="product-details-page">

      {/* Navbar */}
      <nav className="product-details-navbar">

        <button
          className="product-details-logo"
          onClick={() => navigate("/")}
        >
          ShopSphere
        </button>

        <div className="product-details-nav-links">
          <button onClick={() => navigate("/")}>
            Home
          </button>

          <button onClick={() => navigate("/products")}>
            Products
          </button>

          <button onClick={() => navigate("/login")}>
            Login
          </button>
        </div>

        <button
          className="product-details-cart"
          type="button"
        >
          🛒 Cart
        </button>

      </nav>

      {/* Breadcrumb */}
      <div className="product-details-breadcrumb">
        <button onClick={() => navigate("/")}>
          Home
        </button>

        <span>/</span>

        <button onClick={() => navigate("/products")}>
          Products
        </button>

        <span>/</span>

        <span>{product.name}</span>
      </div>

      {/* Product */}
      <main className="product-details-container">

        {/* Image */}
        <div className="product-details-image">

          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
            />
          ) : (
            <div className="product-details-no-image">
              No image available
            </div>
          )}

        </div>

        {/* Information */}
        <div className="product-details-info">

          <p className="product-details-category">
            {product.category}
          </p>

          <h1>
            {product.name}
          </h1>

          <p className="product-details-price">
            ₹{product.price}
          </p>

          <p className="product-details-description">
            {product.description}
          </p>

          <div className="product-details-stock">
            {product.stock > 0
              ? `${product.stock} items available`
              : "Out of stock"}
          </div>

          {product.stock > 0 && (
            <>
              {/* Quantity */}
              <div className="quantity-section">

                <span>
                  Quantity
                </span>

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>

                </div>

              </div>

              {/* Total */}
              <div className="product-details-total">
                <span>
                  Total
                </span>

                <strong>
                  ₹{product.price * quantity}
                </strong>
              </div>

              {/* Buttons */}
              <div className="product-details-actions">

                <button
                  className="add-to-cart-details"
                  type="button"
                >
                  Add to cart
                </button>

                <button
                  className="buy-now-details"
                  type="button"
                >
                  Buy now
                </button>

              </div>
            </>
          )}

          {product.stock <= 0 && (
            <button
              className="out-of-stock-button"
              disabled
            >
              Out of stock
            </button>
          )}

        </div>

      </main>

      {/* Footer */}
      <footer className="product-details-footer">

        <div className="product-details-footer-logo">
          ShopSphere
        </div>

        <p>
          Your multi-vendor marketplace.
        </p>

        <p className="product-details-footer-copy">
          © 2026 ShopSphere. All rights reserved.
        </p>

      </footer>

    </div>
  );
}

export default ProductDetails;