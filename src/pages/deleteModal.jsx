import React from "react";
import "../styles/deleteModal.css";

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>Do you want to delete this ticket?</p>
        <div className="modal-actions">
          <button className="modal-btn yes" onClick={onConfirm}>
            Yes
          </button>
          <button className="modal-btn no" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
