import { Link } from "react-router-dom";

import "../../styles/delivery/delivery-profile.css";
import "../../styles/delivery/delivery-dashboard-page.css";

function DeliveryDashboard() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/login";
  };

  return (
    <div className="delivery-profile-layout">

      {/* ================= SIDEBAR ================= */}

      <aside className="delivery-profile-sidebar">

        <div className="delivery-profile-logo">
          <h2>ShopSphere</h2>
          <span>Delivery Partner</span>
        </div>

        <nav className="delivery-profile-navigation">

          {/* Dashboard */}

          <Link
            to="/delivery/dashboard"
            className="delivery-profile-nav-link active"
          >
            <span>▣</span>
            Dashboard
          </Link>

          {/* Profile */}

          <Link
            to="/delivery/profile"
            className="delivery-profile-nav-link"
          >
            <span>◉</span>
            Profile
          </Link>

        </nav>

        <button
          type="button"
          className="delivery-profile-logout"
          onClick={handleLogout}
        >
          Logout
        </button>

      </aside>

      {/* ================= MAIN CONTENT ================= */}

      <main className="delivery-profile-main">

        {/* ================= TOP BAR ================= */}

        <header className="delivery-profile-topbar">

          <div>
            <h1>Dashboard</h1>

            <p>
              Delivery Partner Dashboard
            </p>
          </div>

          <div className="delivery-dashboard-user">

            <div className="delivery-dashboard-avatar">
              VP
            </div>

            <div className="delivery-dashboard-user-info">

              <strong>Vinay</strong>

              <span>
                Delivery Partner
              </span>

            </div>

          </div>

        </header>

        {/* ================= DASHBOARD CONTENT ================= */}

        <section className="delivery-dashboard-content">

          {/* ================= WELCOME ================= */}

          <div className="delivery-dashboard-welcome">

            <div>

              <p className="delivery-dashboard-label">
                DELIVERY PARTNER
              </p>

              <h2>
                Welcome back, Vinay! 👋
              </h2>

              <p>
                Manage your delivery activities from here.
              </p>

            </div>

          </div>

          {/* ================= DELIVERY STATUS ================= */}

          <section className="delivery-dashboard-grid">

            <div className="delivery-dashboard-panel">

              <div className="delivery-dashboard-panel-header">

                <div>

                  <h2>
                    Delivery Status
                  </h2>

                  <p>
                    Update the status of a delivery order
                  </p>

                </div>

              </div>

              <div className="delivery-dashboard-empty">

                <div className="delivery-dashboard-empty-icon">
                  📦
                </div>

                <h3>
                  No delivery order selected
                </h3>

                <p>
                  Delivery order details will appear here
                  when a valid Seller Order is available.
                </p>

              </div>

            </div>

            {/* ================= BACKEND INFORMATION ================= */}

            <div className="delivery-dashboard-panel">

              <div className="delivery-dashboard-panel-header">

                <div>

                  <h2>
                    Delivery Management
                  </h2>

                  <p>
                    Available backend operation
                  </p>

                </div>

              </div>

              <div className="delivery-dashboard-actions">

                <div className="delivery-dashboard-action">

                  <span>
                    🚚
                  </span>

                  <div>

                    <strong>
                      Update Delivery Status
                    </strong>

                    <small>
                      Use the delivery API to update the
                      status of a Seller Order.
                    </small>

                  </div>

                </div>

              </div>

            </div>

          </section>

        </section>

      </main>

    </div>
  );
}

export default DeliveryDashboard;