import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Login failed.");
        return;
      }

      if (data.user.role !== formData.role) {
        setMessage(
          `This account is registered as ${data.user.role}. Please select the correct login type.`
        );
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Login successful!");

      // Go to Home after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">

        {/* Left Side */}
        <div className="login-brand">
          <div className="brand-logo">
            ShopSphere
          </div>

          <h1>
            Welcome back
            <br />
            to ShopSphere.
          </h1>

          <p>
            Discover products from multiple sellers
            and shop everything you love in one place.
          </p>
        </div>

        {/* Right Side */}
        <div className="login-card">

          <div className="login-header">
            <h2>Sign in</h2>
            <p>
              Choose your account type and enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Login Type */}
            <div className="form-group">
              <label htmlFor="role">
                Login as
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="login-role-select"
                required
              >
                <option value="CUSTOMER">
                  Customer
                </option>

                <option value="SELLER">
                  Seller
                </option>

                <option value="ADMIN">
                  Admin
                </option>

                <option value="DELIVERY">
                  Delivery Partner
                </option>
              </select>
            </div>

            {/* Email */}
            <div className="form-group">
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

            {/* Password */}
            <div className="form-group">
              <div className="password-label">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            {/* Sign In */}
            <button
              className="login-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <p className="login-message">
              {message}
            </p>
          )}

          {/* Divider */}
          <div className="divider">
            <span>or</span>
          </div>

          {/* Google */}
          <button
            className="google-button"
            type="button"
          >
            Continue with Google
          </button>

          {/* Register */}
          <p className="register-text">
            Don't have an account?{" "}

            <button
              type="button"
              className="register-link"
              onClick={() => navigate("/register")}
            >
              Create account
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Login;