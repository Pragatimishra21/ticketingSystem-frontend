import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../services/apiService.js";
import "../styles/login.css";

function Login({ setUserRole }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginUser({ email, password });
      const token = data.token?.token;
      if (!token) throw new Error("Invalid token from server");

      const decodedToken = JSON.parse(atob(token.split(".")[1]));

      const role =
        decodedToken[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];
      const userId = decodedToken["sub"];
      const userName =
        decodedToken[
          "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
        ];
      const userEmail = decodedToken["email"];

      if (!role || !userId) throw new Error("Invalid token claims");

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("userName", userName);
      localStorage.setItem("userEmail", userEmail);

      setUserRole(role);

      navigate(role === "Admin" ? "/dashboard" : "/client");
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="title">Ticketing System</h1>
        <h2 className="subtitle">Login</h2>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn-submit">
            Login
          </button>
          <p className="redirect">
            Don't have an account?{" "}
            <Link to="/register" className="redirect-link">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
