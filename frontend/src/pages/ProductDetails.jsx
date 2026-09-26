import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/product-details.css";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const result = await api(`/products/${id}`);

      if (!result.ok) {
        setMessage(
          result.data.message || "Failed to load product."
        );
        return;
      }

      setProduct(result.data.product);
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

  const addProductToCart = async () => {
    if (!product || product.stock <= 0) {
      return false;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setCartMessage(
        "Please login to add products to your cart."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return false;
    }

    const result = await api("/cart", {
      method: "POST",
      body: JSON.stringify({
        productId: product._id,
        quantity: quantity,
      }),
    });

    if (!result.ok) {
      setCartMessage(
        result.data.message ||
          "Failed to add product to cart."
      );

      return false;
    }

    return true;
  };

  const addToCart = async () => {
    setAddingToCart(true);
    setCartMessage("");

    try {
      const success = await addProductToCart();

      if (!success) {
        return;
      }

      setCartMessage("Product added to cart.");

      setTimeout(() => {
        setCartMessage("");
      }, 2500);
    } catch (error) {
      console.error("Add to cart error:", error);

      setCartMessage(
        "Unable to connect to the server."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  const buyNow = async () => {
    setAddingToCart(true);
    setCartMessage("");

    try {
      const success = await addProductToCart();

      if (!success) {
        return;
      }

      navigate("/cart");
    } catch (error) {
      console.error("Buy now error:", error);

      setCartMessage(
        "Unable to connect to the server."
      );
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="product-details-page">
        <Navbar />

        <p className="product-details-status">
          Loading product...
        </p>

        <Footer />
      </div>
    );
  }

  if (message) {
    return (
      <div className="product-details-page">
        <Navbar />

        <p className="product-details-status">
          {message}
        </p>

        <button
          className="back-products-button"
          type="button"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>

        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <Navbar />

        <p className="product-details-status">
          Product not found.
        </p>

        <button
          className="back-products-button"
          type="button"
          onClick={() => navigate("/products")}
        >
          Back to products
        </button>

        <Footer />
      </div>
    );
  }

  return (
    <div className="product-details-page">

      {/* Common Navbar */}
      <Navbar />

      {/* Breadcrumb */}
      <div className="product-details-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() => navigate("/products")}
        >
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

          <h1>{product.name}</h1>

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
                <span>Quantity</span>

                <div className="quantity-controls">

                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    disabled={quantity === 1}
                  >
                    −
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    disabled={
                      quantity >= product.stock
                    }
                  >
                    +
                  </button>

                </div>
              </div>

              {/* Total */}
              <div className="product-details-total">
                <span>Total</span>

                <strong>
                  ₹
                  {(
                    product.price * quantity
                  ).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </div>

              {/* Cart Message */}
              {cartMessage && (
                <p className="cart-success-message">
                  {cartMessage}
                </p>
              )}

              {/* Actions */}
              <div className="product-details-actions">

                <button
                  className="add-to-cart-details"
                  type="button"
                  onClick={addToCart}
                  disabled={addingToCart}
                >
                  {addingToCart
                    ? "Adding..."
                    : "Add to cart"}
                </button>

                <button
                  className="buy-now-details"
                  type="button"
                  onClick={buyNow}
                  disabled={addingToCart}
                >
                  Buy now
                </button>

              </div>
            </>
          )}

          {product.stock <= 0 && (
            <button
              className="out-of-stock-button"
              type="button"
              disabled
            >
              Out of stock
            </button>
          )}

        </div>
      </main>

      {/* Common Footer */}
      <Footer />

    </div>
  );
}

export default ProductDetails;