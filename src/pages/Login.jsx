/*import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // ✅ NEW
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/tslrd/backend/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      const data = await response.json();

      if (data.success) {
        if (data.role === "admin") {
          navigate("/admin-dashboard"); // Redirect to admin dashboard
        } else {
          onLogin(data.username); // Standard user
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>} { ✅ }
      </form>
    </div>
  );
};

export default Login;
*/
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/login.css";

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess("");
    setLoading(true);

    console.log("Sending login request:", { username, password });

    try {
      const response = await fetch(
        "http://localhost/tslrd/backend/api/login.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();

      console.log("Response data:", data);

      if (data.success) {
        setSuccess("Login successful! Redirecting...");
        setLoading(false);

        setTimeout(() => {
          if (data.role === "admin") {
            navigate("/admin-dashboard");
          } else {
            onLogin(data.username);
            navigate("/");
          }
        }, 2000);
      } else {
        setError(data.message || "Login failed");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h1>LOGIN</h1>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p>
          Don't have an account?{" "}
          <Link to="/register" className="nav-link">
            Register
          </Link>
        </p>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}
      </form>
    </div>
  );
};

export default Login;
