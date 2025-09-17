import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);

  useEffect(() => {
    const trimmed = username.trim();
    if (trimmed.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetch("http://localhost/tslrd/backend/api/checkUsername.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: trimmed }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUsernameAvailable(data.available);
        })
        .catch(() => setUsernameAvailable(null));
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [username]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPhone = phone.trim();
    const trimmedPassword = password.trim();

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!validatePhone(trimmedPhone)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return;
    }
    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (trimmedPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (usernameAvailable === false) {
      setError("Username is already taken");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost/tslrd/backend/api/register.php",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: trimmedUsername,
            email: trimmedEmail,
            phone: trimmedPhone,
            password: trimmedPassword,
          }),
        }
      );

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        setError("Server returned invalid response: " + text);
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("Registration successful! You can now login.");
        setUsername("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");

        setUsernameAvailable(null);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="register-form">
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
        {username && username.length >= 3 && usernameAvailable === false && (
          <p style={{ color: "red", fontSize: "0.9rem" }}>
            Username already exists
          </p>
        )}
        {username && username.length >= 3 && usernameAvailable === true && (
          <p style={{ color: "green", fontSize: "0.9rem" }}>
            Username is available
          </p>
        )}

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label>
          Phone Number:
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Digits only"
          />
        </label>

        <label>
          Password:
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        <label>
          Confirm Password:
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">{success}</p>}

        <Link to="/login" className="nav-link">
          Already have an account? Login
        </Link>
      </form>
    </div>
  );
};

export default Register;
