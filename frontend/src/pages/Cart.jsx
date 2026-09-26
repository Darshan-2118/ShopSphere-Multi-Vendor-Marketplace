import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [updatingProductId, setUpdatingProductId] =
    useState(null);

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
          result.data.message || "Failed to load cart."
        );
        return;
      }

      /*
       * Backend response is not specified in the API handoff.
       * This supports common response formats.
       */
      const responseCart =
        result.data.cart ||
        result.data.items ||
        result.data;

      if (Array.isArray(responseCart)) {
        setCartItems(responseCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Load cart error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
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

  const normalizeCartItem = (item) => {
    const product = getProduct(item);

    return {
      ...item,
      productId: getProductId(item),
      name: product.name || item.name,
      price: product.price ?? item.price ?? 0,
      image: product.image || item.image,
      category:
        product.category || item.category || "Product",
      stock: product.stock ?? item.stock ?? 0,
      quantity: Number(item.quantity) || 1,
    };
  };

  const normalizedCartItems =
    cartItems.map(normalizeCartItem);

  const updateQuantity = async (
    productId,
    quantity
  ) => {
    setUpdatingProductId(productId);
    setMessage("");

    try {
      const result = await api(
        `/cart/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            quantity,
          }),
        }
      );

      if (!result.ok) {
        setMessage(
          result.data.message ||
            "Failed to update cart."
        );
        return;
      }

      await loadCart();
    } catch (error) {
      console.error(
        "Update cart error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const increaseQuantity = (
    productId,
    currentQuantity,
    stock
  ) => {
    if (currentQuantity >= stock) {
      return;
    }

    updateQuantity(
      productId,
      currentQuantity + 1
    );
  };

  const decreaseQuantity = (
    productId,
    currentQuantity
  ) => {
    if (currentQuantity <= 1) {
      return;
    }

    updateQuantity(
      productId,
      currentQuantity - 1
    );
  };

  const removeItem = async (productId) => {
    setUpdatingProductId(productId);
    setMessage("");

    try {
      const result = await api(
        `/cart/${productId}`,
        {
          method: "DELETE",
        }
      );

      if (!result.ok) {
        setMessage(
          result.data.message ||
            "Failed to remove item."
        );
        return;
      }

      await loadCart();
    } catch (error) {
      console.error(
        "Remove cart item error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setUpdatingProductId(null);
    }
  };

  const clearCart = async () => {
    setMessage("");

    try {
      const result = await api(
        "/cart",
        {
          method: "DELETE",
        }
      );

      if (!result.ok) {
        setMessage(
          result.data.message ||
            "Failed to clear cart."
        );
        return;
      }

      setCartItems([]);
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      setMessage(
        "Unable to connect to the server."
      );
    }
  };

  const subtotal =
    normalizedCartItems.reduce(
      (total, item) =>
        total +
        Number(item.price) *
          item.quantity,
      0
    );

  const deliveryCharge =
    normalizedCartItems.length > 0
      ? 50
      : 0;

  const total = subtotal + deliveryCharge;

  const totalItems =
    normalizedCartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  if (loading) {
    return (
      <div className="cart-page">
        <Navbar />

        <main className="cart-main">
          <p className="product-details-status">
            Loading cart...
          </p>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">

      {/* Common ShopSphere Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="cart-main">

        {/* Breadcrumb */}
        <div className="cart-breadcrumb">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>›</span>

          <span>Cart</span>
        </div>

        {/* Heading */}
        <section className="cart-heading">
          <h1>Your Cart</h1>

          <p>
            Review your items before checkout.
          </p>
        </section>

        {/* API Message */}
        {message && (
          <p className="login-message">
            {message}
          </p>
        )}

        {/* Empty Cart */}
        {normalizedCartItems.length === 0 ? (
          <section className="empty-cart-card">

            <div className="empty-cart-icon">
              🛒
            </div>

            <h2>Your cart is empty</h2>

            <p>
              You haven't added any products to
              your cart yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/products")
              }
            >
              Continue shopping
              <span>→</span>
            </button>

          </section>
        ) : (
          <div className="cart-layout">

            {/* Cart Items */}
            <section className="cart-items-card">

              <div className="cart-items-header">

                <div>
                  <h2>
                    {totalItems}{" "}
                    {totalItems === 1
                      ? "item"
                      : "items"}{" "}
                    in your cart
                  </h2>
                </div>

                <button
                  className="clear-cart-button"
                  type="button"
                  onClick={clearCart}
                >
                  <span>♙</span>
                  Clear cart
                </button>

              </div>

              <div className="cart-items-list">

                {normalizedCartItems.map(
                  (item) => (
                    <article
                      className="cart-item"
                      key={item.productId}
                    >

                      {/* Product Image */}
                      <div className="cart-item-image">

                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                          />
                        ) : (
                          <div className="cart-placeholder-image">
                            ShopSphere
                          </div>
                        )}

                      </div>

                      {/* Product Information */}
                      <div className="cart-item-info">

                        <p className="cart-item-category">
                          {item.category}
                        </p>

                        <h3>
                          {item.name}
                        </h3>

                        <p className="cart-item-seller">
                          Seller: ShopSphere
                        </p>

                        <span
                          className={
                            item.stock > 0
                              ? "stock-badge"
                              : "stock-badge out"
                          }
                        >
                          {item.stock > 0
                            ? "In stock"
                            : "Out of stock"}
                        </span>

                        <p className="cart-item-price">
                          ₹
                          {Number(
                            item.price
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </p>

                        {/* Quantity */}
                        <div className="cart-quantity-controls">

                          <button
                            type="button"
                            onClick={() =>
                              decreaseQuantity(
                                item.productId,
                                item.quantity
                              )
                            }
                            disabled={
                              item.quantity <= 1 ||
                              updatingProductId ===
                                item.productId
                            }
                          >
                            −
                          </button>

                          <span>
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              increaseQuantity(
                                item.productId,
                                item.quantity,
                                item.stock
                              )
                            }
                            disabled={
                              item.quantity >=
                                item.stock ||
                              updatingProductId ===
                                item.productId
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* Item Total */}
                      <div className="cart-item-right">

                        <strong>
                          ₹
                          {(
                            Number(
                              item.price
                            ) *
                            item.quantity
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        </strong>

                        <button
                          className="remove-item-button"
                          type="button"
                          onClick={() =>
                            removeItem(
                              item.productId
                            )
                          }
                          disabled={
                            updatingProductId ===
                            item.productId
                          }
                          aria-label={`Remove ${item.name}`}
                        >
                          🗑
                        </button>

                      </div>

                    </article>
                  )
                )}

              </div>

              {/* Continue Shopping */}
              <div className="continue-shopping-wrapper">

                <button
                  className="continue-shopping-link"
                  type="button"
                  onClick={() =>
                    navigate("/products")
                  }
                >
                  ←

                  <span>
                    Continue shopping
                  </span>
                </button>

              </div>

            </section>

            {/* Order Summary */}
            <aside className="cart-summary-card">

              <h2>Order Summary</h2>

              <div className="summary-row">

                <span>
                  Subtotal ({totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"})
                </span>

                <strong>
                  ₹
                  {subtotal.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              <div className="summary-row">

                <span>
                  Delivery
                </span>

                <strong>
                  ₹
                  {deliveryCharge.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              <div className="summary-divider"></div>

              <div className="summary-total">

                <span>
                  Total
                </span>

                <strong>
                  ₹
                  {total.toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}
                </strong>

              </div>

              <button
                className="checkout-button"
                type="button"
                onClick={() =>
                  navigate("/checkout")
                }
              >
                <span>
                  Proceed to checkout
                </span>

                <span>→</span>
              </button>

              <button
                className="summary-shopping-button"
                type="button"
                onClick={() =>
                  navigate("/products")
                }
              >
                Continue shopping
              </button>

              {/* Secure Checkout */}
              <div className="secure-checkout">

                <div className="secure-icon">
                  ♢
                </div>

                <div>

                  <strong>
                    Secure Checkout
                  </strong>

                  <p>
                    Your information is safe
                    with us.
                  </p>

                </div>

              </div>

            </aside>

          </div>
        )}

      </main>

      {/* Common Footer */}
      <Footer />

    </div>
  );
}

export default Cart;