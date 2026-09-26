import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/orders.css";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");

    try {
      const result = await api("/orders/my");

      if (!result.ok) {
        setError(
          result.data.message ||
            "Failed to load your orders."
        );
        return;
      }

      const backendOrders =
        result.data.orders || [];

      setOrders(backendOrders);
    } catch (error) {
      console.error(
        "Order fetch error:",
        error
      );

      setError(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    return `order-status order-status-${String(
      status || ""
    ).toLowerCase()}`;
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getPaymentStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getItemCount = (order) => {
    if (order.items) {
      return order.items.reduce(
        (total, item) =>
          total +
          Number(item.quantity || 0),
        0
      );
    }

    if (order.sellerOrders) {
      return order.sellerOrders.reduce(
        (total, sellerOrder) =>
          total +
          (sellerOrder.items || []).reduce(
            (sellerTotal, item) =>
              sellerTotal +
              Number(item.quantity || 0),
            0
          ),
        0
      );
    }

    return 0;
  };

  const getOrderDate = (order) => {
    if (order.date) {
      return order.date;
    }

    if (order.createdAt) {
      return new Date(
        order.createdAt
      ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    return "Date unavailable";
  };

  const getOrderId = (order) => {
    return order.id || order._id;
  };

  const getOrderStatus = (order) => {
    return (
      order.status ||
      order.orderStatus ||
      order.sellerOrders?.[0]?.status
    );
  };

  const getOrderTotal = (order) => {
    if (order.total !== undefined) {
      return order.total;
    }

    if (order.totalAmount !== undefined) {
      return order.totalAmount;
    }

    return 0;
  };

  const getPaymentStatus = (order) => {
    if (order.paymentStatus) {
      return order.paymentStatus;
    }

    if (
      order.payment?.status
    ) {
      return order.payment.status;
    }

    return "";
  };

  const renderBackendItems = (order) => {
    if (
      !order.sellerOrders ||
      order.sellerOrders.length === 0
    ) {
      return (
        <div className="order-item">

          <div className="order-item-info">

            <p>
              Order item
            </p>

            <h3>
              Product information unavailable
            </h3>

            <span>
              Product details will be loaded
              when available.
            </span>

          </div>

        </div>
      );
    }

    return order.sellerOrders.flatMap(
      (sellerOrder, sellerIndex) =>
        (sellerOrder.items || []).map(
          (item, itemIndex) => {

            const product =
              item.productId &&
              typeof item.productId ===
                "object"
                ? item.productId
                : null;

            const productName =
              product?.name ||
              item.name ||
              `Product ${String(
                item.productId || ""
              )}`;

            const productImage =
              product?.image ||
              item.image ||
              "";

            const productCategory =
              product?.category ||
              item.category ||
              "Product";

            const productPrice =
              Number(
                product?.price ??
                  item.price ??
                  0
              );

            return (
              <div
                className="order-item"
                key={`${sellerOrder._id || sellerIndex}-${itemIndex}`}
              >

                <div className="order-item-image">

                  {productImage ? (
                    <img
                      src={productImage}
                      alt={productName}
                    />
                  ) : (
                    <div className="order-product-placeholder">
                      Product
                    </div>
                  )}

                </div>

                <div className="order-item-info">

                  <p>
                    {productCategory}
                  </p>

                  <h3>
                    {productName}
                  </h3>

                  <span>
                    Qty: {item.quantity}
                  </span>

                </div>

                <strong className="order-item-price">
                  ₹
                  {(
                    productPrice *
                    Number(
                      item.quantity || 0
                    )
                  ).toLocaleString("en-IN")}
                </strong>

              </div>
            );
          }
        )
    );
  };

  return (
    <div className="orders-page">

      <Navbar />

      <main className="orders-main">

        {/* Breadcrumb */}
        <div className="orders-breadcrumb">

          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>›</span>

          <button
            type="button"
            onClick={() =>
              navigate("/account")
            }
          >
            Account
          </button>

          <span>›</span>

          <span>
            My Orders
          </span>

        </div>

        {/* Heading */}
        <section className="orders-heading">

          <div>

            <p className="orders-label">
              SHOPSPHERE ACCOUNT
            </p>

            <h1>
              My Orders
            </h1>

            <p>
              View your recent purchases and
              track your orders.
            </p>

          </div>

          <button
            className="orders-shop-button"
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue shopping
            <span>→</span>
          </button>

        </section>

        {/* Loading */}
        {loading && (
          <div className="orders-demo-notice">

            <strong>
              Loading orders
            </strong>

            <span>
              Checking your ShopSphere order
              history...
            </span>

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="orders-demo-notice">

            <strong>
              Unable to load orders
            </strong>

            <span>
              {error}
            </span>

          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          orders.length === 0 && (
            <section className="orders-empty">

              <h2>
                No orders yet
              </h2>

              <p>
                You have not placed any orders yet.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate("/products")
                }
              >
                Start shopping
              </button>

            </section>
          )}

        {/* Orders */}
        {!loading &&
          !error &&
          orders.length > 0 && (
            <section className="orders-list">

              {orders.map((order) => {

                const orderId =
                  getOrderId(order);

                const status =
                  getOrderStatus(order);

                const total =
                  getOrderTotal(order);

                const itemCount =
                  getItemCount(order);

                const paymentStatus =
                  getPaymentStatus(order);

                return (
                  <article
                    className="order-card"
                    key={orderId}
                  >

                    {/* Order Header */}
                    <div className="order-card-top">

                      <div>

                        <p className="order-number-label">
                          ORDER
                        </p>

                        <h2>
                          {orderId}
                        </h2>

                      </div>

                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {getStatusLabel(
                          status
                        )}
                      </span>

                    </div>

                    {/* Order Information */}
                    <div className="order-card-info">

                      <div>

                        <span>
                          Order date
                        </span>

                        <strong>
                          {getOrderDate(
                            order
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Items
                        </span>

                        <strong>
                          {itemCount}{" "}
                          {itemCount === 1
                            ? "item"
                            : "items"}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Payment
                        </span>

                        <strong>
                          {getPaymentStatusLabel(
                            paymentStatus
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Total
                        </span>

                        <strong>
                          ₹
                          {Number(
                            total || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </strong>

                      </div>

                    </div>

                    {/* Order Items */}
                    <div className="order-items">
                      {renderBackendItems(
                        order
                      )}
                    </div>

                    {/* Bottom */}
                    <div className="order-card-bottom">

                      <p>
                        {status ===
                          "DELIVERED"
                          ? "Your order has been delivered."
                          : status ===
                              "SHIPPED"
                            ? "Your order is on its way."
                            : status ===
                                "CANCELLED"
                              ? "This order has been cancelled."
                              : "Your order is being prepared."}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/orders/${orderId}`
                          )
                        }
                      >
                        View details
                        <span>→</span>
                      </button>

                    </div>

                  </article>
                );
              })}

            </section>
          )}

      </main>

      <Footer />

    </div>
  );
}

export default Orders;