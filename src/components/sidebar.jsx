import React from "react";
import "../components/sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.includes("dashboard")
    ? "dashboard"
    : location.pathname.includes("tickets")
    ? "tickets"
    : "";

  return (
    <div className="sidebar">
      <h2>Hey! Admin</h2>
      <button
        className={currentPage === "dashboard" ? "active" : ""}
        onClick={() => navigate("/dashboard")}
      >
        Dashboard
      </button>
      <button
        className={currentPage === "tickets" ? "active" : ""}
        onClick={() => navigate("/tickets")}
      >
        Tickets
      </button>
    </div>
  );
}
