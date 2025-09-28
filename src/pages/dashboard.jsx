import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import { getAllTickets } from "../services/apiService";

function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const data = await getAllTickets();
    setTickets(data);
    console.log("Fetched tickets:", data); // Check actual status values
  };

  // Normalize status for consistency
  const normalizeStatus = (status) => status?.trim().toLowerCase();

  // Summary Counts
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(
    (t) => normalizeStatus(t.status) === "open"
  ).length;
  const inProgressTickets = tickets.filter(
    (t) => normalizeStatus(t.status) === "in_progress"
  ).length;
  const resolvedTickets = tickets.filter(
    (t) => normalizeStatus(t.status) === "resolved"
  ).length;

  // Pie Chart Data
  const pieData = [
    { name: "Open", value: openTickets },
    { name: "In Progress", value: inProgressTickets },
    { name: "Resolved", value: resolvedTickets },
  ];
  const COLORS = ["#0814ff", "#dece76", "#165202"];

  // Bar Chart Data (Tickets created per month)
  const monthlyData = tickets.reduce((acc, ticket) => {
    const month = new Date(ticket.createdAt).toLocaleString("default", {
      month: "short",
    });
    if (!acc[month]) acc[month] = 0;
    acc[month]++;
    return acc;
  }, {});

  const barData = Object.keys(monthlyData).map((month) => ({
    month,
    tickets: monthlyData[month],
  }));

  return (
    <Box sx={{ padding: 3 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" fontWeight={500}>
          Tickets Analytics
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={5} mb={5}>
        {[
          { title: "Total Tickets", value: totalTickets },
          { title: "Open Tickets", value: openTickets },
          { title: "In Progress", value: inProgressTickets },
          { title: "Resolved Tickets", value: resolvedTickets },
        ].map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6">{card.title}</Typography>
                <Typography
                  variant="h4"
                  sx={{ color: "#6410c9", fontWeight: "bold" }}
                >
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Ticket Status Distribution
              </Typography>
              <PieChart width={350} height={250}>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  dataKey="value"
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" mb={2}>
                Tickets Created Per Month
              </Typography>
              <BarChart width={400} height={250} data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="tickets" fill="#6410c9" />
              </BarChart>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="h6" mb={2}>
            Recent Tickets
          </Typography>
          <TableContainer component={Paper} sx={{ maxHeight: 300 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id} hover>
                    <TableCell>{ticket.id}</TableCell>
                    <TableCell>{ticket.title}</TableCell>
                    <TableCell>{ticket.status}</TableCell>
                    <TableCell>
                      {new Date(ticket.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default Dashboard;
