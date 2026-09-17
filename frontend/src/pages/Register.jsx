import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setMessage("Registration successful!");

      // Go to Home after successful registration
      navigate("/");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">

        {/* Left Side */}
        <div className="register-brand">
          <div className="register-logo">
            ShopSphere
          </div>

          <h1>
            Join the
            <br />
            ShopSphere community.
          </h1>

          <p>
            Create your account and become part of
            our multi-vendor marketplace.
          </p>
        </div>

        {/* Right Side */}
        <div className="register-card">

          <div className="register-header">
            <h2>Create account</h2>

            <p>
              Choose your account type and enter your details
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* Account Type */}
            <div className="register-form-group">
              <label htmlFor="role">
                Account type
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="role-select"
                required
              >
                <option value="CUSTOMER">
                  Customer
                </option>

                <option value="SELLER">
                  Seller
                </option>

                <option value="DELIVERY">
                  Delivery Partner
                </option>
              </select>
            </div>

            {/* Full Name */}
            <div className="register-form-group">
              <label htmlFor="name">
                Full name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div className="register-form-group">
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
            <div className="register-form-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                required
                minLength={6}
              />
            </div>

            {/* Confirm Password */}
            <div className="register-form-group">
              <label htmlFor="confirmPassword">
                Confirm password
              </label>

              <input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength={6}
              />
            </div>

            {/* Create Account */}
            <button
              className="register-button"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}
            </button>

          </form>

          {/* Message */}
          {message && (
            <p className="register-message">
              {message}
            </p>
          )}

          {/* Login */}
          <p className="login-text">
            Already have an account?{" "}

            <button
              type="button"
              className="login-link"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;