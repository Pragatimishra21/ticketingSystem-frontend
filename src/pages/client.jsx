import React, { useEffect, useState, useRef } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Container,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { motion, AnimatePresence } from "framer-motion";
import ClientDashboard from "./clientDashboard";
import ClientModal from "./clientModal";

const Client = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showTag, setShowTag] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const dashboardRef = useRef();

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedEmail = localStorage.getItem("userEmail");

    if (storedName) setUserName(storedName);
    if (storedEmail) setUserEmail(storedEmail);

    const timer = setTimeout(() => setShowTag(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Box sx={{ flexGrow: 1, backgroundColor: "white", minHeight: "100vh" }}>
      <AppBar
        position="static"
        sx={{ backgroundColor: "#db3072", color: "#fcfcfc" }}
      >
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Hey! {userName}
            </Typography>
            <Typography variant="body2">{userEmail}</Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              backgroundColor: "white",
              color: "#db3072",
              fontWeight: "bold",
            }}
            onClick={() => setDrawerOpen(true)}
          >
            Create
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ padding: 3 }}>
        <AnimatePresence>
          {showTag && (
            <motion.div
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ duration: 0.8 }}
              style={{
                display: "inline-block",
                backgroundColor: "#f7f7e6",
                color: "#2b2b2a",
                padding: "8px 16px",
                borderRadius: "20px",
                fontWeight: "bold",
              }}
            >
              Welcome to your Dashboard 🎉
            </motion.div>
          )}
        </AnimatePresence>
      </Container>

      <ClientDashboard ref={dashboardRef} />

      <ClientModal
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onTicketCreated={() => dashboardRef.current?.fetchTickets?.()}
      />
    </Box>
  );
};

export default Client;
