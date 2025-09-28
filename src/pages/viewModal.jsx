import React, { useState, useEffect } from "react";
import { getAllUsers, updateTicketStatus } from "../services/apiService";
import "../styles/viewModal.css";

function ViewModal({ isOpen, onClose, ticket, onUpdate }) {
  const [status, setStatus] = useState("");
  const [assignee, setAssignee] = useState(""); // store as string for stable matching
  const [supportUsers, setSupportUsers] = useState([]);

  useEffect(() => {
    if (ticket) {
      setStatus(ticket.status || "open");
      if (ticket.assignedToId !== undefined && ticket.assignedToId !== null) {
        setAssignee(String(ticket.assignedToId));
      } else {
        setAssignee("");
      }
    }
  }, [ticket]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getAllUsers();
        const supportOnly = users.filter(
          (u) => u.role?.toLowerCase() === "support"
        );
        setSupportUsers(supportOnly.map((u) => ({ ...u, id: String(u.id) })));
      } catch (err) {
        console.error("Failed to fetch users", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (
      ticket &&
      !assignee &&
      ticket.assignedToName &&
      Array.isArray(supportUsers) &&
      supportUsers.length
    ) {
      const match = supportUsers.find(
        (u) =>
          u.name?.toLowerCase().trim() ===
          String(ticket.assignedToName).toLowerCase().trim()
      );
      if (match) setAssignee(match.id);
    }
  }, [supportUsers, ticket, assignee]);

  if (!isOpen || !ticket) return null;

  const handleSave = async () => {
    try {
      const assignedToParam =
        assignee && assignee !== "" ? parseInt(assignee, 10) : null;

      await updateTicketStatus(ticket.id, status, assignedToParam);
      onUpdate && onUpdate("success", "Ticket updated successfully");
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      onUpdate && onUpdate("error", "Failed to update ticket");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>

        {/* Title */}
        <h2 className="modal-title">Edit Ticket</h2>
        <hr className="divider" />

        <div className="ticket-details">
          <p>
            <strong>ID:</strong> #{ticket.id}
          </p>

          {/* Subject */}
          <label>
            <strong>Subject:</strong>
          </label>
          <input type="text" value={ticket.title} disabled />

          {/* Description */}
          {ticket.description && (
            <>
              <label>
                <strong>Description:</strong>
              </label>
              <textarea value={ticket.description} disabled rows={3} />
            </>
          )}

          {/* Status */}
          <label>
            <strong>Status:</strong>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="styled-select"
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Assignee */}
          <label>
            <strong>Assignee:</strong>
          </label>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            className="styled-select"
          >
            <option value="">Unassigned</option>
            {supportUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>

          {/* Save Button */}
          <div style={{ marginTop: "20px" }}>
            <button className="save-btn" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
