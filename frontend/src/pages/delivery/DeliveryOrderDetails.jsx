import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import "../../styles/delivery/delivery-order-details.css";
import api from "../../services/api";

function DeliveryOrderDetails() {
  const navigate = useNavigate();
  const { sellerOrderId } = useParams();

  const [status, setStatus] = useState("CONFIRMED");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateStatus = async () => {
    if (!sellerOrderId) {
      setError("Seller order ID is missing.");
      return;
    }

    setUpdating(true);
    setMessage("");
    setError("");

    try {
      const result = await api(
        `/delivery/${sellerOrderId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            status,
          }),
        }
      );

      if (!result.ok) {
        setError(
          result.data?.message ||
            "Unable to update delivery status."
        );
        return;
      }

      setMessage(
        `Delivery status updated to ${status}.`
      );
    } catch (err) {
      console.error(
        "Delivery status update error:",
        err
      );

      setError(
        "Unable to update delivery status."
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="delivery-order-details-page">
      <main className="delivery-order-details-main">

        <button
          type="button"
          className="delivery-back-button"
          onClick={() =>
            navigate("/delivery/dashboard")
          }
        >
          ← Back to Dashboard
        </button>

        <div className="delivery-order-header">
          <div>
            <p className="delivery-page-label">
              Delivery Partner
            </p>

            <h1>
              Delivery Order
            </h1>

            <p>
              Update the delivery status for this
              seller order.
            </p>
          </div>
        </div>

        <section className="delivery-order-card">

          <div className="delivery-order-info">
            <span>
              Seller Order ID
            </span>

            <strong>
              {sellerOrderId || "Not available"}
            </strong>
          </div>

          <div className="delivery-order-info">
            <span>
              Current selected status
            </span>

            <strong>
              {status}
            </strong>
          </div>

        </section>

        <section className="delivery-status-card">

          <h2>
            Update Delivery Status
          </h2>

          <p>
            Select the status that should be sent
            to the backend.
          </p>

          <label htmlFor="delivery-status">
            Delivery Status
          </label>

          <select
            id="delivery-status"
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
            disabled={updating}
          >
            <option value="CONFIRMED">
              CONFIRMED
            </option>

            <option value="PROCESSING">
              PROCESSING
            </option>

            <option value="SHIPPED">
              SHIPPED
            </option>

            <option value="DELIVERED">
              DELIVERED
            </option>

            <option value="CANCELLED">
              CANCELLED
            </option>
          </select>

          {message && (
            <div className="delivery-success-message">
              {message}
            </div>
          )}

          {error && (
            <div className="delivery-error-message">
              {error}
            </div>
          )}

          <button
            type="button"
            className="delivery-update-button"
            onClick={updateStatus}
            disabled={
              updating || !sellerOrderId
            }
          >
            {updating
              ? "Updating..."
              : "Update Status"}
          </button>

        </section>

        <section className="delivery-status-info-card">
          <h2>
            Supported Statuses
          </h2>

          <div className="delivery-status-list">
            <span>CONFIRMED</span>
            <span>PROCESSING</span>
            <span>SHIPPED</span>
            <span>DELIVERED</span>
            <span>CANCELLED</span>
          </div>
        </section>

      </main>
    </div>
  );
}

export default DeliveryOrderDetails;