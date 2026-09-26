import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import "../../styles/delivery/delivery-profile.css";

function DeliveryProfile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");

      const result = await api("/auth/me");

      if (!result.ok) {
        setError(
          result.data?.message || "Unable to load profile."
        );
        setLoading(false);
        return;
      }

      setUser(result.data?.user || result.data);
      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
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
            className="delivery-profile-nav-link"
          >
            <span>▣</span>
            Dashboard
          </Link>

          {/* Profile */}

          <Link
            to="/delivery/profile"
            className="delivery-profile-nav-link active"
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

        <header className="delivery-profile-topbar">
          <div>
            <h1>My Profile</h1>
            <p>
              View your delivery partner account information.
            </p>
          </div>
        </header>

        <section className="delivery-profile-content">

          {loading && (
            <div className="delivery-profile-card">
              <p className="delivery-profile-message">
                Loading profile...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="delivery-profile-card">
              <p className="delivery-profile-error">
                {error}
              </p>
            </div>
          )}

          {!loading && !error && user && (
            <div className="delivery-profile-card">

              <div className="delivery-profile-user-header">

                <div className="delivery-profile-avatar">
                  {user.name
                    ? user.name.charAt(0).toUpperCase()
                    : "D"}
                </div>

                <div>
                  <h2>
                    {user.name || "Delivery Partner"}
                  </h2>

                  <p>
                    {user.role || "DELIVERY"}
                  </p>
                </div>

              </div>

              <div className="delivery-profile-details">

                <div className="delivery-profile-field">
                  <span>Name</span>
                  <strong>
                    {user.name || "Not available"}
                  </strong>
                </div>

                <div className="delivery-profile-field">
                  <span>Email</span>
                  <strong>
                    {user.email || "Not available"}
                  </strong>
                </div>

                <div className="delivery-profile-field">
                  <span>Role</span>
                  <strong>
                    {user.role || "DELIVERY"}
                  </strong>
                </div>

              </div>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default DeliveryProfile;