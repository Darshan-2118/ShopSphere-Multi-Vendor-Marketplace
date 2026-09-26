import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

import Footer from "../components/Footer";

import api from "../services/api";

import "../styles/checkout.css";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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
        "Load checkout cart error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (cart.length === 0) {
      setMessage("Your cart is empty.");
      return;
    }

    setMessage("");

    navigate("/payment");
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <Navbar />

        <main className="checkout-empty">
          <p>Loading checkout...</p>
        </main>

        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <Navbar />

        <main className="checkout-empty">
          <div className="checkout-empty-icon">
            🛒
          </div>

          <h1>Your cart is empty</h1>

          <p>
            Add some products to your cart before
            proceeding to checkout.
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
    <div className="checkout-page">
      <Navbar />

      {/* Breadcrumb */}
      <div className="checkout-breadcrumb">
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

        <span>Checkout</span>
      </div>

      <main className="checkout-container">
        <div className="checkout-heading">
          <p className="checkout-label">
            SHOPSPHERE CHECKOUT
          </p>

          <h1>
            Complete your order
          </h1>

          <p>
            Enter your delivery details and review
            your order before continuing to payment.
          </p>
        </div>

        <form
          className="checkout-layout"
          onSubmit={handleSubmit}
        >
          <div className="checkout-left">

            {/* Contact Information */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-step">
                    01
                  </span>

                  <div>
                    <h2>
                      Contact information
                    </h2>

                    <p>
                      We'll use these details for
                      your order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-form-group full-width">
                  <label htmlFor="fullName">
                    Full name
                  </label>

                  <input
                    id="fullName"
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="email">
                    Email address
                  </label>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="phone">
                    Phone number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Delivery Address */}
            <section className="checkout-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-step">
                    02
                  </span>

                  <div>
                    <h2>
                      Delivery address
                    </h2>

                    <p>
                      Where should we deliver your
                      order?
                    </p>
                  </div>
                </div>
              </div>

              <div className="checkout-form-grid">
                <div className="checkout-form-group full-width">
                  <label htmlFor="address">
                    Address
                  </label>

                  <textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="House number, street, area"
                    rows="4"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="city">
                    City
                  </label>

                  <input
                    id="city"
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter your city"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="state">
                    State
                  </label>

                  <input
                    id="state"
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter your state"
                    required
                  />
                </div>

                <div className="checkout-form-group">
                  <label htmlFor="pincode">
                    PIN code
                  </label>

                  <input
                    id="pincode"
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="Enter PIN code"
                    maxLength="6"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Payment */}
            <section className="checkout-card checkout-payment-card">
              <div className="checkout-card-header">
                <div>
                  <span className="checkout-step">
                    03
                  </span>

                  <div>
                    <h2>
                      Payment
                    </h2>

                    <p>
                      Continue to the payment page
                      to complete your order.
                    </p>
                  </div>
                </div>
              </div>

              <div className="checkout-payment-placeholder">
                <div className="checkout-payment-icon">
                  ✓
                </div>

                <div>
                  <strong>
                    Payment
                  </strong>

                  <p>
                    You can review your order and
                    complete the payment on the
                    next step.
                  </p>
                </div>
              </div>
            </section>

            {message && (
              <div className="checkout-message">
                {message}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <aside className="checkout-summary">
            <div className="checkout-summary-header">
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

            <div className="checkout-summary-items">
              {normalizedCart.map((item) => (
                <div
                  className="checkout-summary-item"
                  key={item.productId}
                >
                  <div className="checkout-summary-image">
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

                  <div className="checkout-summary-info">
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

            <div className="checkout-summary-divider" />

            <div className="checkout-price-row">
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

            <div className="checkout-price-row">
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

            <div className="checkout-summary-divider" />

            <div className="checkout-total-row">
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
              className="checkout-place-order"
              type="submit"
            >
              Continue to Payment
            </button>

            <button
              className="checkout-back-button"
              type="button"
              onClick={() =>
                navigate("/cart")
              }
            >
              ← Back to cart
            </button>

            <p className="checkout-secure-note">
              Your order information is kept
              secure.
            </p>
          </aside>
        </form>
      </main>

      <Footer />
    </div>
  );
}

export default Checkout;