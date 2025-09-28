import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Box, Typography } from "@mui/material";
import { getUserTickets } from "../services/apiService";

const ClientDashboard = forwardRef((props, ref) => {
  const [tickets, setTickets] = useState([]);
  const userId = localStorage.getItem("userId");

  const fetchTickets = async () => {
    try {
      const data = await getUserTickets(userId);
      setTickets(data);
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  useImperativeHandle(ref, () => ({
    fetchTickets,
  }));

  const raisedCount = tickets.length;
  const resolvedCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "resolved"
  ).length;
  const pendingCount = tickets.filter(
    (t) => t.status?.toLowerCase() === "open"
  ).length;

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "green";
      case "in_progress":
        return "orange";
      case "resolved":
        return "purple";
      default:
        return "grey";
    }
  };

  return (
    <Box sx={{ px: 2, py: 3 }}>
      {/* Circle Counters */}
      <Box sx={{ display: "flex", gap: 4, mb: 4, justifyContent: "center" }}>
        {/* Raised */}
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "4px solid #0088FE",
            backgroundColor: "rgba(0, 136, 254, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {raisedCount}
          </Typography>
          <Typography>Total Raised</Typography>
        </Box>

        {/* Resolved */}
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "4px solid #00C49F",
            backgroundColor: "rgba(0, 196, 159, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {resolvedCount}
          </Typography>
          <Typography>Total Resolved</Typography>
        </Box>

        {/* Pending */}
        <Box
          sx={{
            width: 150,
            height: 150,
            borderRadius: "50%",
            border: "4px solid #FFBB28",
            backgroundColor: "rgba(255, 187, 40, 0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            {pendingCount}
          </Typography>
          <Typography>Still Pending</Typography>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Your Tickets
        </Typography>

        {tickets.length === 0 ? (
          <Box
            sx={{
              padding: 2,
              backgroundColor: "#f8d7da",
              color: "#842029",
              borderRadius: 1,
              textAlign: "center",
            }}
          >
            No tickets raised yet.
          </Box>
        ) : (
          <Box
            sx={{ borderTop: "1px solid #ccc", borderBottom: "1px solid #ccc" }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                fontWeight: "bold",
                textAlign: "center",
                backgroundColor: "#f0f0f0",
              }}
            >
              <Box sx={{ flex: 1, borderRight: "1px solid #ccc", p: 1 }}>
                Ticket-Id
              </Box>
              <Box sx={{ flex: 2, borderRight: "1px solid #ccc", p: 1 }}>
                Issue
              </Box>
              <Box sx={{ flex: 1, borderRight: "1px solid #ccc", p: 1 }}>
                Status
              </Box>
              <Box sx={{ flex: 1, p: 1 }}>Created-On</Box>
            </Box>

            {/* Rows */}
            {tickets.map((t, index) => {
              const statusColor = getStatusColor(t.status);
              return (
                <Box
                  key={t.id}
                  sx={{
                    display: "flex",
                    textAlign: "center",
                    backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9f9f9",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {/* Ticket-Id with status dot */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      p: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 1,
                    }}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: statusColor,
                      }}
                    />
                    <Typography variant="body2">{t.id}</Typography>
                  </Box>

                  {/* Issue */}
                  <Box sx={{ flex: 2, borderRight: "1px solid #eee", p: 1 }}>
                    {t.title}
                  </Box>

                  {/* Status */}
                  <Box
                    sx={{
                      flex: 1,
                      borderRight: "1px solid #eee",
                      p: 1,
                      color: statusColor,
                      fontWeight: "bold",
                    }}
                  >
                    {t.status}
                  </Box>

                  {/* Created-On */}
                  <Box sx={{ flex: 1, p: 1 }}>
                    {t.createdAt
                      ? new Date(t.createdAt).toLocaleDateString()
                      : "-"}
                  </Box>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
});

export default ClientDashboard;
