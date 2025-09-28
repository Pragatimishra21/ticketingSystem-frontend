import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/sidebar";
import Dashboard from "./pages/dashboard";
import Tickets from "./pages/tickets";
import Login from "./pages/login";
import Register from "./pages/register";
import Client from "./pages/client";

export default function App() {
  const [userRole, setUserRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      setUserRole(decodedToken.role);
    }
  }, []);

  return (
    <Router>
      <div style={{ display: "flex", minHeight: "100vh" }}>
        {userRole === "Admin" && (
          <Sidebar
            currentPage={
              window.location.pathname.includes("dashboard")
                ? "dashboard"
                : "tickets"
            }
          />
        )}
        <div
          style={{ flex: 1, backgroundColor: "#ecf0f1", minHeight: "100vh" }}
        >
          <Routes>
            <Route
              path="/login"
              element={
                userRole ? (
                  <Navigate
                    to={userRole === "Admin" ? "/dashboard" : "/client"}
                  />
                ) : (
                  <Login setCurrentPage={() => {}} setUserRole={setUserRole} />
                )
              }
            />
            <Route
              path="/register"
              element={<Register setUserRole={setUserRole} />}
            />
            <Route
              path="/dashboard"
              element={
                userRole === "Admin" ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/tickets"
              element={
                userRole === "Admin" ? <Tickets /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/client"
              element={
                userRole === "Client" ? <Client /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/"
              element={
                userRole ? (
                  <Navigate
                    to={userRole === "Admin" ? "/dashboard" : "/client"}
                  />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}
