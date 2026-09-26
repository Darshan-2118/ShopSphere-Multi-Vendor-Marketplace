import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";

import "../styles/returns.css";

function Returns() {
  const navigate = useNavigate();

  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReturns = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const result = await api("/returns");

        if (!result.ok) {
          setError(
            result.data?.message ||
              "Unable to load your return requests."
          );
          return;
        }

        const returnData =
          result.data?.returns ||
          result.data?.returnRequests ||
          result.data ||
          [];

        setReturns(
          Array.isArray(returnData)
            ? returnData
            : []
        );
      } catch (err) {
        console.error(
          "Returns loading error:",
          err
        );

        setError(
          "Unable to load your return requests."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [navigate]);

  const getReturnId = (returnItem) => {
    return (
      returnItem?._id ||
      returnItem?.id ||
      "N/A"
    );
  };

  const getSellerOrderId = (returnItem) => {
    return (
      returnItem?.sellerOrderId?._id ||
      returnItem?.sellerOrderId ||
      returnItem?.sellerOrder?._id ||
      returnItem?.sellerOrder?.id ||
      "N/A"
    );
  };

  const getStatus = (returnItem) => {
    return (
      returnItem?.status ||
      returnItem?.returnStatus ||
      "REQUESTED"
    );
  };

  const getStatusLabel = (status) => {
    return String(status)
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );
  };

  const getStatusClass = (status) => {
    const normalized = String(
      status || "requested"
    )
      .toLowerCase()
      .replace(/_/g, "-");

    return `return-status ${normalized}`;
  };

  const getReason = (returnItem) => {
    return (
      returnItem?.reason ||
      "No reason provided"
    );
  };

  const getReturnDate = (returnItem) => {
    const date =
      returnItem?.createdAt ||
      returnItem?.requestedAt ||
      returnItem?.date;

    if (!date) {
      return "Date unavailable";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  };

  const getRefundInfo = (returnItem) => {
    const status = String(
      getStatus(returnItem)
    ).toUpperCase();

    if (status === "REFUNDED") {
      return "Refund processed";
    }

    if (status === "APPROVED") {
      return "Return approved";
    }

    if (status === "REJECTED") {
      return "Refund not processed";
    }

    return "Refund pending";
  };

  if (loading) {
    return (
      <div className="returns-page">
        <Navbar />

        <main className="returns-container">
          <div className="returns-loading">
            <p>
              Loading your returns...
            </p>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="returns-page">
      <Navbar />

      <main className="returns-container">
        <div className="returns-breadcrumb">
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

          <span>Returns</span>
        </div>

        <div className="returns-header">
          <div>
            <h1>My Returns</h1>

            <p>
              View and track your return
              requests.
            </p>
          </div>

          <button
            type="button"
            className="returns-orders-button"
            onClick={() =>
              navigate("/orders")
            }
          >
            View My Orders
          </button>
        </div>

        {error && (
          <div className="returns-error">
            {error}
          </div>
        )}

        {!error && returns.length === 0 && (
          <div className="returns-empty">
            <div className="returns-empty-icon">
              ↩
            </div>

            <h2>
              No return requests
            </h2>

            <p>
              You haven't submitted any
              return requests yet.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/orders")
              }
            >
              View My Orders
            </button>
          </div>
        )}

        {!error && returns.length > 0 && (
          <div className="returns-list">
            {returns.map(
              (returnItem, index) => {
                const status =
                  getStatus(returnItem);

                return (
                  <div
                    className="return-card"
                    key={
                      getReturnId(
                        returnItem
                      ) !== "N/A"
                        ? getReturnId(
                            returnItem
                          )
                        : index
                    }
                  >
                    <div className="return-card-header">
                      <div>
                        <span className="return-label">
                          Return Request
                        </span>

                        <h2>
                          #
                          {getReturnId(
                            returnItem
                          )}
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

                    <div className="return-details">
                      <div className="return-detail">
                        <span>
                          Seller Order
                        </span>

                        <strong>
                          {getSellerOrderId(
                            returnItem
                          )}
                        </strong>
                      </div>

                      <div className="return-detail">
                        <span>
                          Requested On
                        </span>

                        <strong>
                          {getReturnDate(
                            returnItem
                          )}
                        </strong>
                      </div>

                      <div className="return-detail">
                        <span>
                          Refund
                        </span>

                        <strong>
                          {getRefundInfo(
                            returnItem
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="return-reason">
                      <span>
                        Reason
                      </span>

                      <p>
                        {getReason(
                          returnItem
                        )}
                      </p>
                    </div>

                    <div className="return-card-footer">
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/orders/${getSellerOrderId(
                              returnItem
                            )}`
                          )
                        }
                      >
                        View Order
                      </button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default Returns;