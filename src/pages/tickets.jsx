import React, { useState, useEffect } from "react";
import { getAllTickets, deleteTickets } from "../services/apiService";
import { FaEye, FaTrash, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DeleteModal from "../pages/deleteModal";
import ViewModal from "../pages/viewModal";
import "../styles/tickets.css";

function Tickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const [message, setMessage] = useState(null);

  // Filters
  const [reporterFilter, setReporterFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const ticketsData = await getAllTickets();
      setTickets(ticketsData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch tickets");
      setLoading(false);
    }
  };

  const handleDeleteClick = (ticketId) => {
    setSelectedTicket(ticketId);
    setShowDeleteModal(true);
  };

  const handleViewClick = (ticket) => {
    setSelectedTicket(ticket);
    setShowViewModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTickets([selectedTicket]);
      setTickets((prev) => prev.filter((t) => t.id !== selectedTicket));
      setMessage({ type: "success", text: "Ticket deleted successfully" });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to delete ticket" });
    } finally {
      setShowDeleteModal(false);
      setSelectedTicket(null);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  // Filtered tickets based on search & dropdowns
  const filteredTickets = tickets.filter((ticket) => {
    const matchesReporter = ticket.createdByName
      ?.toLowerCase()
      .includes(reporterFilter.toLowerCase());
    const matchesStatus = statusFilter ? ticket.status === statusFilter : true;
    const matchesPriority = priorityFilter
      ? ticket.priority === priorityFilter
      : true;
    return matchesReporter && matchesStatus && matchesPriority;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTickets = filteredTickets.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Fetching Tickets...</p>
      </div>
    );
  }

  if (error) return <div className="error">{error}</div>;

  return (
    <div className="tickets-container">
      {/* Top-right toast */}
      <div className="toast-container">
        {message && (
          <div className={`toast ${message.type}`}>{message.text}</div>
        )}
      </div>

      {/* Filters Row */}
      <div className="filters-row">
        {/* Reporter Search */}
        <input
          type="text"
          placeholder="Search by Reporter"
          value={reporterFilter}
          onChange={(e) => setReporterFilter(e.target.value)}
          className="search-input"
        />

        {/* Status & Priority Dropdowns */}
        <div className="dropdowns-container">
          <div className="dropdowns">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="dropdown"
            >
              <option value="">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="dropdown"
            >
              <option value="">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tickets Table */}
      <table className="tickets-table">
        <thead>
          <tr>
            <th>Ticket-Id</th>
            <th>Subject</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Reporter</th>
            <th>Assignee</th>
            <th>Raised On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket.id}>
              <td>#{ticket.id}</td>
              <td className="subject-col">{ticket.title}</td>
              <td>{ticket.status}</td>
              <td>
                <span
                  className={`priority-badge ${ticket.priority.toLowerCase()}`}
                >
                  {ticket.priority}
                </span>
              </td>
              <td>{ticket.createdByName || "Unassigned"}</td>
              <td>{ticket.assignedToName || "Unassigned"}</td>
              <td>
                {new Date(ticket.createdAt).toLocaleString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td className="actions-col">
                <FaEye
                  className="action-icon view-icon"
                  onClick={() => handleViewClick(ticket)}
                />
                <FaTrash
                  className="action-icon delete-icon"
                  onClick={() => handleDeleteClick(ticket.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={prevPage}
            className="pagination-btn"
            disabled={currentPage === 1}
          >
            <FaChevronLeft /> Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`pagination-btn ${
                currentPage === i + 1 ? "active" : ""
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextPage}
            className="pagination-btn"
            disabled={currentPage === totalPages}
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}

      <DeleteModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        ticket={selectedTicket}
        onUpdate={async (type, text) => {
          await fetchTickets();
          setMessage({ type, text });
          setTimeout(() => setMessage(null), 3000);
        }}
      />
    </div>
  );
}

export default Tickets;
