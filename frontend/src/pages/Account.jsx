import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/account.css";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login to view your account.");
        setLoading(false);
        return;
      }

      try {
        const result = await api("/auth/me");

        if (!result.ok) {
          setError(
            result.data?.message ||
              "Unable to load account information."
          );
          return;
        }

        const userData =
          result.data?.user || result.data;

        if (!userData) {
          setError("Account information not found.");
          return;
        }

        setUser(userData);

        // Keep localStorage user information updated
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      } catch (error) {
        console.error("Account user error:", error);
        setError("Unable to load account information.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const getInitials = () => {
    if (!user?.name) {
      return "C";
    }

    return user.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) =>
        word.charAt(0).toUpperCase()
      )
      .join("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  if (loading) {
    return (
      <div className="account-page">
        <Navbar />

        <main className="account-loading">
          Loading account...
        </main>

        <Footer />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="account-page">
        <Navbar />

        <main className="account-loading">
          <h2>Unable to load account</h2>

          <p>
            {error ||
              "Please login again to continue."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="account-page">
      <Navbar />

      <main className="account-main">
        <div className="account-breadcrumb">
          <button
            type="button"
            onClick={() => navigate("/")}
          >
            Home
          </button>

          <span>›</span>

          <span>Account</span>
        </div>

        <section className="account-heading">
          <p className="account-label">
            SHOPSPHERE ACCOUNT
          </p>

          <h1>My Account</h1>

          <p>
            Manage your profile and keep track of your
            shopping activity.
          </p>
        </section>

        <div className="account-layout">
          <aside className="account-sidebar">
            <div className="account-profile-mini">
              <div className="account-avatar">
                {getInitials()}
              </div>

              <div className="account-profile-mini-info">
                <h2>{user.name}</h2>

                <p>{user.email}</p>
              </div>
            </div>

            <nav className="account-menu">
              <button
                className="account-menu-active"
                type="button"
              >
                <span className="account-menu-icon">
                  ◎
                </span>

                Profile
              </button>

              <button
                type="button"
                onClick={() => navigate("/orders")}
              >
                <span className="account-menu-icon">
                  ▤
                </span>

                My Orders
              </button>

              <button
                type="button"
                onClick={() => navigate("/returns")}
              >
                <span className="account-menu-icon">
                  ↩
                </span>

                My Returns
              </button>

              <button
                type="button"
                onClick={() => navigate("/cart")}
              >
                <span className="account-menu-icon">
                  🛒
                </span>

                Cart
              </button>
            </nav>

            <button
              className="account-logout"
              type="button"
              onClick={handleLogout}
            >
              <span>↪</span>
              Sign out
            </button>
          </aside>

          <section className="account-content">
            <div className="account-card">
              <div className="account-card-header">
                <div>
                  <p className="account-card-label">
                    PROFILE
                  </p>

                  <h2>Personal information</h2>

                  <p>
                    Your account information from
                    ShopSphere.
                  </p>
                </div>

                <div className="account-card-avatar">
                  {getInitials()}
                </div>
              </div>

              <div className="account-info-grid">
                <div className="account-info-item">
                  <span>Full name</span>

                  <strong>{user.name}</strong>
                </div>

                <div className="account-info-item">
                  <span>Email address</span>

                  <strong>{user.email}</strong>
                </div>

                <div className="account-info-item">
                  <span>Account type</span>

                  <strong>
                    {user.role === "CUSTOMER"
                      ? "Customer"
                      : user.role}
                  </strong>
                </div>

                <div className="account-info-item">
                  <span>Member status</span>

                  <strong className="account-status">
                    Active
                  </strong>
                </div>
              </div>
            </div>

            <div className="account-card">
              <div className="account-card-header simple">
                <div>
                  <p className="account-card-label">
                    SHOPPING
                  </p>

                  <h2>Your ShopSphere activity</h2>

                  <p>
                    Quickly access the things you use
                    most.
                  </p>
                </div>
              </div>

              <div className="account-quick-actions">
                <button
                  type="button"
                  onClick={() => navigate("/orders")}
                >
                  <div className="account-action-icon">
                    ▤
                  </div>

                  <div>
                    <strong>My Orders</strong>

                    <span>
                      View your orders and delivery
                      status
                    </span>
                  </div>

                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/returns")}
                >
                  <div className="account-action-icon">
                    ↩
                  </div>

                  <div>
                    <strong>My Returns</strong>

                    <span>
                      Track your return requests and
                      refund status
                    </span>
                  </div>

                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                >
                  <div className="account-action-icon">
                    🛒
                  </div>

                  <div>
                    <strong>Shopping Cart</strong>

                    <span>
                      Review products waiting in your
                      cart
                    </span>
                  </div>

                  <b>→</b>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/products")}
                >
                  <div className="account-action-icon">
                    ▦
                  </div>

                  <div>
                    <strong>Browse Products</strong>

                    <span>
                      Discover products from sellers
                    </span>
                  </div>

                  <b>→</b>
                </button>
              </div>
            </div>

            <div className="account-signout-card">
              <div>
                <h3>Sign out of ShopSphere</h3>

                <p>
                  You can sign back in anytime using
                  your account credentials.
                </p>
              </div>

              <button
                type="button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Account;