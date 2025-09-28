import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  Snackbar,
  Alert,
} from "@mui/material";
import { createTicket, getAllUsers } from "../services/apiService";

export default function ClientModal({ open, onClose, onTicketCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const userId = parseInt(localStorage.getItem("userId"));

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        await getAllUsers();
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    fetchUsers();
  }, []);

  const handleSave = async () => {
    if (!title.trim()) {
      setSnackbar({
        open: true,
        message: "Title is required!",
        severity: "error",
      });
      return;
    }

    const ticketPayload = {
      Title: title,
      Description: description,
      Priority: priority,
      CreatedBy: userId,
      AssignedTo: null,
      CategoryID: null,
    };

    try {
      const created = await createTicket(ticketPayload);
      setSnackbar({
        open: true,
        message: "Ticket created successfully!",
        severity: "success",
      });
      onTicketCreated?.(created);
      setTitle("");
      setDescription("");
      setPriority("Medium");
      onClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Failed to create ticket.",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            p: 3,
            display: "flex",
            flexDirection: "column",
            gap: 1.5, // reduced gap
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Create New Ticket
          </Typography>

          <Typography sx={{ fontWeight: "bold" }}>Title</Typography>
          <TextField
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Typography sx={{ fontWeight: "bold" }}>Description</Typography>
          <TextField
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            multiline
            rows={4}
          />

          <Typography sx={{ fontWeight: "bold" }}>Priority</Typography>
          <FormControl fullWidth>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="Low">Low</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="High">High</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
            <Button variant="contained" onClick={handleSave}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
