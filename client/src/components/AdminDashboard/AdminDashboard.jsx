import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#C48CB3",
      cancelButtonColor: "rgba(250, 102, 102, 1)",
      confirmButtonText: "Yes, logout!",
    });
    if (result.isConfirmed) {
      await auth.signOut();
      navigate("/login");
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      {/* Navbar */}
      <AppBar position="fixed" sx={{ bgcolor: "#C48CB3" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          {/* Left side - Title */}
          <Typography variant="h6" fontWeight={700}>
            JobTracker - Admin Panel
          </Typography>

          {/* Right side - Avatar */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0 }}>
            <Avatar
              sx={{
                bgcolor: "#fff",
                color: "#C48CB3",
                width: 42,
                height: 42,
                fontWeight: 600,
                fontSize: "16px",
              }}
            >
              {user?.displayName
                ? user.displayName.slice(0, 2).toUpperCase()
                : user?.email?.slice(0, 2).toUpperCase()}
            </Avatar>
          </IconButton>

          {/* Dropdown Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 0, 
          py: 1,
          mt: { xs: 8, sm: 10 },
          bgcolor: "#fdf4fa",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
