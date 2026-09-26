import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "../styles/order-details.css";

function OrderDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [returnRequests, setReturnRequests] = useState([]);
  const [returnLoading, setReturnLoading] = useState(false);

  const [activeReturnId, setActiveReturnId] = useState(null);
  const [returnReason, setReturnReason] = useState("");
  const [returnMessage, setReturnMessage] = useState("");
  const [returnError, setReturnError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view order details.");
        setLoading(false);
        return;
      }

      try {
        const result = await api(`/orders/${id}`);

        if (!result.ok) {
          setError(
            result.data?.message ||
              "Unable to load order details."
          );
          return;
        }

        const orderData =
          result.data?.order || result.data;

        if (!orderData) {
          setError("Order not found.");
          return;
        }

        setOrder(orderData);
      } catch (err) {
        console.error("Order details error:", err);
        setError("Unable to load order details.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  useEffect(() => {
    const fetchReturns = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const result = await api("/returns");

        if (!result.ok) {
          return;
        }

        const returns =
          result.data?.returns ||
          result.data?.returnRequests ||
          result.data ||
          [];

        setReturnRequests(
          Array.isArray(returns) ? returns : []
        );
      } catch (err) {
        console.error(
          "Return requests error:",
          err
        );
      }
    };

    fetchReturns();
  }, []);

  const getOrderId = () => {
    return order?.id || order?._id || id;
  };

  const getOrderStatus = () => {
    if (!order) return "";

    if (order.status) {
      return order.status;
    }

    if (order.orderStatus) {
      return order.orderStatus;
    }

    if (order.sellerOrders?.length > 0) {
      return (
        order.sellerOrders[0]?.status ||
        "PLACED"
      );
    }

    return "PLACED";
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Unknown";
    }

    return String(status)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "")
      .toLowerCase()
      .replace(/_/g, "-");

    return `order-detail-status ${normalized}`;
  };

  const getOrderDate = () => {
    if (!order) {
      return "Date unavailable";
    }

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

  const getPaymentStatus = () => {
    return getStatusLabel(
      order?.paymentStatus ||
        order?.payment?.status ||
        "PENDING"
    );
  };

  const getBackendItems = () => {
    if (!order?.sellerOrders) {
      return [];
    }

    return order.sellerOrders.flatMap(
      (sellerOrder) => {
        if (!sellerOrder?.items) {
          return [];
        }

        return sellerOrder.items.map((item) => ({
          productId:
            item.productId?._id ||
            item.productId ||
            item.product?._id ||
            item.product?.id ||
            "unknown",

          product:
            item.product ||
            (typeof item.productId === "object"
              ? item.productId
              : null),

          quantity: Number(
            item.quantity || 0
          ),

          price: Number(item.price || 0),

          sellerOrderId:
            sellerOrder._id ||
            sellerOrder.id,

          sellerOrderStatus:
            sellerOrder.status,
        }));
      }
    );
  };

  const getBackendSubtotal = () => {
    return getBackendItems().reduce(
      (total, item) =>
        total +
        Number(item.price) *
          Number(item.quantity),
      0
    );
  };

  const getTotal = () => {
    if (!order) {
      return 0;
    }

    if (order.total !== undefined) {
      return Number(order.total);
    }

    if (order.totalAmount !== undefined) {
      return Number(order.totalAmount);
    }

    if (order.grandTotal !== undefined) {
      return Number(order.grandTotal);
    }

    if (order.amount !== undefined) {
      return Number(order.amount);
    }

    return getBackendSubtotal();
  };

  const getTimelineState = () => {
    const status = String(
      getOrderStatus() || ""
    ).toUpperCase();

    const statuses = [
      "PLACED",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
    ];

    if (
      status === "CANCELLED" ||
      status === "REFUNDED"
    ) {
      return 0;
    }

    const index =
      statuses.indexOf(status);

    if (index === -1) {
      return 0;
    }

    return index;
  };

  const renderTimeline = () => {
    const currentStep =
      getTimelineState();

    const steps = [
      { label: "Placed" },
      { label: "Confirmed" },
      { label: "Processing" },
      { label: "Shipped" },
      { label: "Delivered" },
    ];

    return (
      <div className="order-timeline">
        {steps.map((step, index) => (
          <div
            key={step.label}
            className={`timeline-step ${
              index <= currentStep
                ? "completed"
                : ""
            }`}
          >
            <span>
              {index <= currentStep
                ? "✓"
                : index + 1}
            </span>

            <div>
              <strong>
                {step.label}
              </strong>
            </div>

            {index <
              steps.length - 1 && (
              <div
                className={`timeline-line ${
                  index < currentStep
                    ? "active"
                    : ""
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const getProductName = (item) => {
    if (item.product?.name) {
      return item.product.name;
    }

    if (item.product?.title) {
      return item.product.title;
    }

    return `Product ID: ${String(
      item.productId
    )}`;
  };

  const getProductCategory = (item) => {
    if (item.product?.category) {
      return item.product.category;
    }

    return "Product";
  };

  const getProductImage = (item) => {
    if (item.product?.image) {
      return item.product.image;
    }

    if (
      item.product?.images?.length > 0
    ) {
      return item.product.images[0];
    }

    return null;
  };

  const renderBackendItems = () => {
    const items = getBackendItems();

    if (items.length === 0) {
      return (
        <div className="order-detail-item">
          <div className="order-detail-item-info">
            <p>Order item</p>

            <h3>
              Product details unavailable
            </h3>

            <span>
              Product information is not
              included in the current order
              response.
            </span>
          </div>
        </div>
      );
    }

    return items.map((item, index) => {
      const image =
        getProductImage(item);

      return (
        <div
          className="order-detail-item"
          key={`${item.productId}-${index}`}
        >
          {image ? (
            <img
              src={image}
              alt={getProductName(item)}
            />
          ) : (
            <div
              style={{
                width: "85px",
                height: "100px",
                borderRadius: "8px",
                background: "#f3f3f3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#888",
                fontSize: "12px",
                textAlign: "center",
                padding: "5px",
              }}
            >
              Product
            </div>
          )}

          <div className="order-detail-item-info">
            <p>
              {getProductCategory(item)}
            </p>

            <h3>
              {getProductName(item)}
            </h3>

            <span>
              Quantity: {item.quantity}
            </span>
          </div>

          <strong>
            ₹
            {(
              Number(item.price) *
              Number(item.quantity)
            ).toLocaleString("en-IN")}
          </strong>
        </div>
      );
    });
  };

  const getItemCount = () => {
    return getBackendItems().reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );
  };

  const getSellerOrderReturn = (
    sellerOrderId
  ) => {
    return returnRequests.find(
      (returnRequest) => {
        const requestSellerOrderId =
          returnRequest?.sellerOrderId?._id ||
          returnRequest?.sellerOrderId ||
          returnRequest?.sellerOrder?._id ||
          returnRequest?.sellerOrder?.id;

        return (
          String(requestSellerOrderId) ===
          String(sellerOrderId)
        );
      }
    );
  };

  const canRequestReturn = (
    sellerOrderStatus
  ) => {
    const normalizedStatus = String(
      sellerOrderStatus || ""
    ).toUpperCase();

    return (
      normalizedStatus !== "CANCELLED" &&
      normalizedStatus !== "REFUNDED"
    );
  };

  const openReturnForm = (
    sellerOrderId
  ) => {
    setActiveReturnId(sellerOrderId);
    setReturnReason("");
    setReturnMessage("");
    setReturnError("");
  };

  const cancelReturnForm = () => {
    setActiveReturnId(null);
    setReturnReason("");
    setReturnMessage("");
    setReturnError("");
  };

  const submitReturnRequest = async (
    sellerOrderId
  ) => {
    if (!sellerOrderId) {
      setReturnError(
        "Seller order ID is missing."
      );
      return;
    }

    if (!returnReason.trim()) {
      setReturnError(
        "Please enter a reason for the return."
      );
      return;
    }

    setReturnLoading(true);
    setReturnMessage("");
    setReturnError("");

    try {
      const result = await api(
        "/returns",
        {
          method: "POST",
          body: JSON.stringify({
            sellerOrderId,
            reason: returnReason.trim(),
          }),
        }
      );

      if (!result.ok) {
        setReturnError(
          result.data?.message ||
            "Unable to submit return request."
        );
        return;
      }

      const newReturn =
        result.data?.return ||
        result.data?.returnRequest ||
        result.data;

      if (newReturn) {
        setReturnRequests(
          (previous) => [
            ...previous,
            newReturn,
          ]
        );
      }

      setReturnMessage(
        "Return request submitted successfully."
      );

      setReturnReason("");
      setActiveReturnId(null);
    } catch (err) {
      console.error(
        "Submit return error:",
        err
      );

      setReturnError(
        "Unable to submit return request."
      );
    } finally {
      setReturnLoading(false);
    }
  };

  const renderReturnSection = () => {
    if (
      !order?.sellerOrders ||
      order.sellerOrders.length === 0
    ) {
      return null;
    }

    return (
      <section className="delivery-card">
        <h2>Returns</h2>

        <p
          style={{
            marginBottom: "16px",
            color: "#666",
          }}
        >
          Return requests are created for
          individual seller orders.
        </p>

        {returnMessage && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "12px",
              borderRadius: "8px",
              background: "#eaf7ea",
              color: "#287a28",
            }}
          >
            {returnMessage}
          </div>
        )}

        {returnError && (
          <div
            style={{
              padding: "10px 12px",
              marginBottom: "12px",
              borderRadius: "8px",
              background: "#fdecec",
              color: "#b42318",
            }}
          >
            {returnError}
          </div>
        )}

        {order.sellerOrders.map(
          (sellerOrder, index) => {
            const sellerOrderId =
              sellerOrder?._id ||
              sellerOrder?.id;

            const sellerOrderStatus =
              sellerOrder?.status ||
              "PLACED";

            const existingReturn =
              getSellerOrderReturn(
                sellerOrderId
              );

            const returnStatus =
              existingReturn?.status ||
              existingReturn?.returnStatus;

            const isTerminal =
              !canRequestReturn(
                sellerOrderStatus
              );

            return (
              <div
                key={
                  sellerOrderId ||
                  index
                }
                style={{
                  border: "1px solid #e5e5e5",
                  borderRadius: "10px",
                  padding: "16px",
                  marginBottom: "14px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <div>
                    <strong>
                      Seller Order
                    </strong>

                    <p
                      style={{
                        margin:
                          "5px 0 0",
                      }}
                    >
                      Status:{" "}
                      {getStatusLabel(
                        sellerOrderStatus
                      )}
                    </p>
                  </div>

                  {existingReturn ? (
                    <strong>
                      Return:{" "}
                      {getStatusLabel(
                        returnStatus
                      )}
                    </strong>
                  ) : isTerminal ? (
                    <span
                      style={{
                        color: "#777",
                        fontWeight: "600",
                      }}
                    >
                      Return not available
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() =>
                        openReturnForm(
                          sellerOrderId
                        )
                      }
                    >
                      Request Return
                    </button>
                  )}
                </div>

                {activeReturnId ===
                  sellerOrderId && (
                  <div
                    style={{
                      marginTop: "16px",
                      paddingTop: "16px",
                      borderTop:
                        "1px solid #eee",
                    }}
                  >
                    <label
                      htmlFor={`return-reason-${sellerOrderId}`}
                      style={{
                        display: "block",
                        marginBottom: "8px",
                        fontWeight: "600",
                      }}
                    >
                      Reason for return
                    </label>

                    <textarea
                      id={`return-reason-${sellerOrderId}`}
                      value={returnReason}
                      onChange={(event) =>
                        setReturnReason(
                          event.target.value
                        )
                      }
                      placeholder="Enter the reason for returning this order..."
                      rows="4"
                      style={{
                        width: "100%",
                        boxSizing:
                          "border-box",
                        padding: "10px",
                        border:
                          "1px solid #ccc",
                        borderRadius: "8px",
                        resize: "vertical",
                      }}
                    />

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        marginTop: "12px",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          submitReturnRequest(
                            sellerOrderId
                          )
                        }
                        disabled={
                          returnLoading
                        }
                      >
                        {returnLoading
                          ? "Submitting..."
                          : "Submit Return"}
                      </button>

                      <button
                        type="button"
                        onClick={
                          cancelReturnForm
                        }
                        disabled={
                          returnLoading
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          }
        )}
      </section>
    );
  };

  if (loading) {
    return (
      <div className="order-details-page">
        <Navbar />

        <div className="order-details-container">
          <div className="order-not-found">
            <p>
              Loading order details...
            </p>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-details-page">
        <Navbar />

        <div className="order-details-container">
          <div className="order-not-found">
            <h1>Order not found</h1>

            <p>
              {error ||
                "We couldn't find this order."}
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/orders")
              }
            >
              View all orders
            </button>
          </div>
        </div>

        <Footer />
      </div>
    );
  }

  const status = getOrderStatus();
  const orderId = getOrderId();

  const subtotal =
    getBackendSubtotal();

  const total = getTotal();

  const delivery = Math.max(
    0,
    total - subtotal
  );

  return (
    <div className="order-details-page">
      <Navbar />

      <div className="order-details-container">
        <div className="order-details-breadcrumb">
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

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
          >
            My Orders
          </button>

          <span>›</span>

          <span>
            Order Details
          </span>
        </div>

        <div className="order-details-header">
          <div>
            <button
              className="back-orders-button"
              type="button"
              onClick={() =>
                navigate("/orders")
              }
            >
              ← Back to orders
            </button>

            <h1>
              Order #{orderId}
            </h1>

            <p>
              Order status:{" "}
              {getStatusLabel(status)}
            </p>

            <span className="order-date">
              Placed on {getOrderDate()}
            </span>
          </div>

          <span
            className={getStatusClass(
              status
            )}
          >
            {getStatusLabel(status)}
          </span>
        </div>

        <div className="order-status-card">
          <div className="order-status-icon">
            ✓
          </div>

          <div>
            <h3>
              {getStatusLabel(status)}
            </h3>

            <p>
              Your order is currently{" "}
              {getStatusLabel(
                status
              ).toLowerCase()}
              .
            </p>
          </div>
        </div>

        {renderTimeline()}

        <div className="order-details-grid">
          <section className="order-items-section">
            <div className="order-section-title">
              <h2>Order items</h2>

              <span>
                {getItemCount()}{" "}
                {getItemCount() === 1
                  ? "item"
                  : "items"}
              </span>
            </div>

            <div className="order-detail-items">
              {renderBackendItems()}
            </div>
          </section>

          <section className="order-summary-section">
            <h2>
              Order summary
            </h2>

            <div className="summary-row">
              <span>Subtotal</span>

              <span>
                ₹
                {subtotal.toLocaleString(
                  "en-IN"
                )}
              </span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>

              <span>
                {delivery > 0
                  ? `₹${delivery.toLocaleString(
                      "en-IN"
                    )}`
                  : "Included"}
              </span>
            </div>

            <div className="summary-divider" />

            <div className="summary-total">
              <span>Total</span>

              <strong>
                ₹
                {total.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>

            <div className="payment-method">
              <span>
                Payment status
              </span>

              <strong>
                {getPaymentStatus()}
              </strong>
            </div>
          </section>
        </div>

        {order.shippingAddress && (
          <section className="delivery-card">
            <h2>
              Delivery address
            </h2>

            <div className="delivery-content">
              {order.shippingAddress
                .name && (
                <strong>
                  {
                    order.shippingAddress
                      .name
                  }
                </strong>
              )}

              {order.shippingAddress
                .address && (
                <p>
                  {
                    order.shippingAddress
                      .address
                  }
                </p>
              )}

              {(order.shippingAddress
                .city ||
                order.shippingAddress
                  .state ||
                order.shippingAddress
                  .pincode) && (
                <p>
                  {
                    order.shippingAddress
                      .city
                  }

                  {order.shippingAddress
                    .city &&
                    order.shippingAddress
                      .state
                    ? ", "
                    : ""}

                  {
                    order.shippingAddress
                      .state
                  }{" "}
                  {
                    order.shippingAddress
                      .pincode
                  }
                </p>
              )}

              {order.shippingAddress
                .phone && (
                <p>
                  Phone:{" "}
                  {
                    order.shippingAddress
                      .phone
                  }
                </p>
              )}
            </div>
          </section>
        )}

        {renderReturnSection()}

        <div className="order-details-actions">
          <button
            className="continue-shopping-button"
            type="button"
            onClick={() =>
              navigate("/products")
            }
          >
            Continue shopping
          </button>

          <button
            className="orders-button"
            type="button"
            onClick={() =>
              navigate("/orders")
            }
          >
            View all orders
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default OrderDetails;