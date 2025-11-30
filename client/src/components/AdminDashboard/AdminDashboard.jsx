import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";
import Swal from "sweetalert2";
import {
  Box,
  Typography,
  AppBar,
  Toolbar,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
} from "@mui/material";
import {
  Brightness4,
  Brightness7,
  WorkOutline,
  Logout,
  AdminPanelSettings,
} from "@mui/icons-material";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

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
      confirmButtonColor: primaryColor,
      cancelButtonColor: "#f66666",
      confirmButtonText: "Yes, logout!",
      background: isDark ? "#1A1A1A" : "#FFFFFF",
      color: isDark ? "#FFFFFF" : "#000000",
    });

    if (result.isConfirmed) {
      await auth.signOut();
      navigate("/login");
    }
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)"
          : "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
      }}
    >
      {/* Navbar */}
      <AppBar
        position="fixed"
        sx={{
          background: isDark
            ? "linear-gradient(135deg, #1A1A1A 0%, #2D1B2E 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FDF4FF 100%)",
          boxShadow: isDark
            ? "0 4px 20px rgba(0,0,0,0.3)"
            : "0 4px 20px rgba(0,0,0,0.1)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", px: 3 }}
        >
          {/* Left side - Logo and Title */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: isDark
                  ? "linear-gradient(135deg, #C48CB3 0%, #E8B4D9 100%)"
                  : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
                color: "#FFFFFF",
                boxShadow: "0 4px 15px rgba(196,140,179,0.3)",
              }}
            >
              <WorkOutline />
            </Box>
            <Typography
              variant="h6"
              fontWeight={800}
              sx={{
                background: isDark
                  ? "linear-gradient(135deg, #E8B4D9 0%, #FFFFFF 100%)"
                  : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: "1.25rem",
              }}
            >
              CareerHive Admin
            </Typography>
          </Box>

          {/* Right side - Theme Toggle and Avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle Button */}
            <IconButton
              onClick={handleThemeToggle}
              sx={{
                color: isDark ? "#E8B4D9" : "#C48CB3",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.05)",
                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {isDark ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {/* Admin Badge */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                px: 2,
                py: 0.5,
                borderRadius: "12px",
                background: isDark
                  ? "rgba(196,140,179,0.2)"
                  : "rgba(196,140,179,0.1)",
                border: `1px solid ${primaryColor}30`,
              }}
            >
              <AdminPanelSettings
                sx={{
                  fontSize: 18,
                  color: isDark ? "#E8B4D9" : "#A86B97",
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "#E8B4D9" : "#A86B97",
                  fontWeight: 600,
                  fontSize: "0.8rem",
                }}
              >
                Admin
              </Typography>
            </Box>

            {/* User Avatar */}
            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <Avatar
                sx={{
                  background: isDark
                    ? "linear-gradient(135deg, #C48CB3 0%, #E8B4D9 100%)"
                    : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
                  color: "#FFFFFF",
                  width: 42,
                  height: 42,
                  fontWeight: 600,
                  fontSize: "16px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
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
              sx={{
                "& .MuiPaper-root": {
                  background: isDark
                    ? "linear-gradient(135deg, #1A1A1A 0%, #2D1B2E 100%)"
                    : "linear-gradient(135deg, #FFFFFF 0%, #FDF4FF 100%)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.08)",
                  boxShadow: isDark
                    ? "0 8px 32px rgba(0,0,0,0.4)"
                    : "0 8px 32px rgba(0,0,0,0.1)",
                  borderRadius: "12px",
                  minWidth: 160,
                },
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: isDark ? "#E8B4D9" : "#A86B97",
                  fontWeight: 600,
                  "&:hover": {
                    background: isDark
                      ? "rgba(196,140,179,0.2)"
                      : "rgba(196,140,179,0.1)",
                  },
                }}
              >
                <Logout sx={{ mr: 1, fontSize: 20 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          px: 3,
          py: 2,
          mt: { xs: 8, sm: 10 },
          background: "transparent", // 👈 ياخد الخلفية من الـ Box الأب
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
