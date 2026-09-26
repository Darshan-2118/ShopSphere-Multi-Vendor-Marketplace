import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import api from "../services/api";

import "../styles/payment.css";

function Payment() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setLoading(true);
    setMessage("");

    try {
      const result = await api("/cart");

      if (!result.ok) {
        setMessage(
          result.data.message ||
            "Failed to load cart."
        );
        return;
      }

      const responseCart =
        result.data.cart ||
        result.data.items ||
        result.data;

      if (Array.isArray(responseCart)) {
        setCart(responseCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error(
        "Load payment cart error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const getProduct = (item) => {
    if (
      item.productId &&
      typeof item.productId === "object"
    ) {
      return item.productId;
    }

    if (item.product) {
      return item.product;
    }

    return item;
  };

  const getProductId = (item) => {
    if (typeof item.productId === "string") {
      return item.productId;
    }

    if (item.productId?._id) {
      return item.productId._id;
    }

    if (item.product?._id) {
      return item.product._id;
    }

    return item._id;
  };

  const normalizedCart = cart.map((item) => {
    const product = getProduct(item);

    return {
      ...item,
      productId: getProductId(item),
      name: product.name || item.name,
      price: product.price ?? item.price ?? 0,
      image: product.image || item.image,
      quantity: Number(item.quantity) || 1,
    };
  });

  const subtotal = normalizedCart.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.quantity || 0),
    0
  );

  const deliveryCharge =
    normalizedCart.length > 0 ? 50 : 0;

  const total = subtotal + deliveryCharge;

  const totalItems = normalizedCart.reduce(
    (total, item) =>
      total + Number(item.quantity || 0),
    0
  );

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setPlacingOrder(true);
    setMessage("");

    try {
      const result = await api("/orders", {
        method: "POST",
      });

      if (!result.ok) {
        setMessage(
          result.data.message ||
            "Failed to place order."
        );
        return;
      }

      navigate("/orders");
    } catch (error) {
      console.error(
        "Place order error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="payment-page">
        <Navbar />

        <main className="payment-empty">
          <p>Loading payment...</p>
        </main>

        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="payment-page">
        <Navbar />

        <main className="payment-empty">
          <div className="payment-empty-icon">
            🛒
          </div>

          <h1>Your cart is empty</h1>

          <p>
            Add products to your cart before
            proceeding to payment.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue shopping
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="payment-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="payment-breadcrumb">
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          Home
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() => navigate("/cart")}
        >
          Cart
        </button>

        <span>/</span>

        <button
          type="button"
          onClick={() =>
            navigate("/checkout")
          }
        >
          Checkout
        </button>

        <span>/</span>

        <span>Payment</span>
      </div>

      <main className="payment-container">
        <div className="payment-heading">
          <p className="payment-label">
            SHOPSPHERE PAYMENT
          </p>

          <h1>
            Complete your order
          </h1>

          <p>
            Review your order and confirm your
            purchase.
          </p>
        </div>

        <div className="payment-layout">

          {/* Payment Section */}
          <div className="payment-left">

            <section className="payment-card">
              <div className="payment-card-header">
                <div>
                  <span className="payment-step">
                    01
                  </span>

                  <div>
                    <h2>
                      Payment method
                    </h2>

                    <p>
                      Choose how you want to
                      complete your order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="payment-method">
                <div className="payment-method-icon">
                  💳
                </div>

                <div className="payment-method-info">
                  <strong>
                    Online payment
                  </strong>

                  <p>
                    Payment gateway integration
                    is not connected in the current
                    MVP.
                  </p>
                </div>

                <div className="payment-method-selected">
                  ✓
                </div>
              </div>

              <div className="payment-notice">
                <strong>
                  Payment gateway
                </strong>

                <p>
                  No external payment gateway is
                  connected in the current MVP.
                  The order will be created through
                  the ShopSphere backend.
                </p>
              </div>
            </section>

            <section className="payment-card">
              <div className="payment-card-header">
                <div>
                  <span className="payment-step">
                    02
                  </span>

                  <div>
                    <h2>
                      Order confirmation
                    </h2>

                    <p>
                      Your order will be created
                      after confirmation.
                    </p>
                  </div>
                </div>
              </div>

              <div className="payment-confirmation">
                <div className="payment-confirmation-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Ready to place your order
                  </strong>

                  <p>
                    Review your order summary and
                    click Place Order.
                  </p>
                </div>
              </div>
            </section>

            {message && (
              <div className="payment-message">
                {message}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className="payment-summary">
            <div className="payment-summary-header">
              <h2>
                Order summary
              </h2>

              <span>
                {totalItems}{" "}
                {totalItems === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="payment-summary-items">
              {normalizedCart.map((item) => (
                <div
                  className="payment-summary-item"
                  key={item.productId}
                >
                  <div className="payment-summary-image">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <span>
                        No image
                      </span>
                    )}
                  </div>

                  <div className="payment-summary-info">
                    <h3>
                      {item.name}
                    </h3>

                    <p>
                      Qty: {item.quantity}
                    </p>

                    <strong>
                      ₹
                      {(
                        Number(item.price || 0) *
                        Number(item.quantity || 0)
                      ).toLocaleString("en-IN")}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="payment-summary-divider" />

            <div className="payment-price-row">
              <span>
                Subtotal
              </span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="payment-price-row">
              <span>
                Delivery
              </span>

              <span>
                ₹
                {deliveryCharge.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="payment-summary-divider" />

            <div className="payment-total-row">
              <span>
                Total
              </span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <button
              className="payment-place-order"
              type="button"
              onClick={handlePlaceOrder}
              disabled={placingOrder}
            >
              {placingOrder
                ? "Placing order..."
                : "Place Order"}
            </button>

            <button
              className="payment-back-button"
              type="button"
              onClick={() =>
                navigate("/checkout")
              }
              disabled={placingOrder}
            >
              ← Back to checkout
            </button>

            <p className="payment-secure-note">
              Your order information is kept
              secure.
            </p>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Payment;