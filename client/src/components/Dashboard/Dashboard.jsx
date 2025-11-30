import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  AppBar,
  Toolbar,
  ListItemIcon,
  Collapse,
  useMediaQuery,
} from "@mui/material";
import { collection, query, where, getDocs } from "firebase/firestore";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ListAltIcon from "@mui/icons-material/ListAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AssignmentIcon from "@mui/icons-material/Assignment";
import InsightsIcon from "@mui/icons-material/Insights";
import ChatIcon from "@mui/icons-material/Chat";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import CloseIcon from "@mui/icons-material/Close";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  // 👇 حاول يجيب من السلايس، ولو فاضي يرجع لفirebase
  const userSlice = useSelector((state) => state.user || {});
  const firebaseUser = auth.currentUser;

  const userName =
    userSlice.name ||
    firebaseUser?.displayName ||
    (firebaseUser?.email ? firebaseUser.email.split("@")[0] : "");

  const isMobile = useMediaQuery("(max-width: 900px)");

    console.log("🔍 userSlice from Redux:", userSlice);
    console.log("🔍 firebaseUser:", firebaseUser);
    console.log("🔍 userName used in navbar:", userName);


  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [aiOpen, setAiOpen] = useState(false);

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  const handleSidebarToggle = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: primaryColor,
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, logout!",
      background: isDark ? "#1A1A1A" : "#FFFFFF",
      color: isDark ? "#FFFFFF" : "#000000",
    });

    if (result.isConfirmed) {
      await auth.signOut();
      setSidebarOpen(false);
      navigate("/login");
    }
  };

  const navItems = [
    { label: "My Profile", path: "profile", icon: <PersonIcon /> },
    { label: "Create Application", path: "createapp", icon: <AddCircleIcon /> },
    { label: "Applications List", path: "applications", icon: <ListAltIcon /> },
  ];

  const aiServices = [
    {
      label: "Resume Feedback",
      path: "resume-feedback",
      icon: <AssignmentIcon />,
    },
    { label: "Job Analyzer", path: "job-analyze", icon: <PsychologyIcon /> },
    {
      label: "Dashboard Insights",
      path: "dashboard-insights",
      icon: <InsightsIcon />,
    },
    { label: "Career Chatbot", path: "chatbot", icon: <ChatIcon /> },
  ];

  useEffect(() => {
    const fetchApplications = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setApplications([]);
        setLoading(false);
        return;
      }

      try {
        const q = query(
          collection(db, "applications"),
          where("uid", "==", currentUser.uid)
        );
        const snapshot = await getDocs(q);
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setApplications(apps);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const drawerContent = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: isDark
          ? "linear-gradient(180deg, #1A1A1A 0%, #2D1B2E 100%)"
          : "linear-gradient(180deg, #FFFFFF 0%, #FDF4FF 100%)",
        color: isDark ? "#FFFFFF" : "#000000",
        borderRight: isDark
          ? "1px solid rgba(255,255,255,0.1)"
          : "1px solid rgba(0,0,0,0.05)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background Effects */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: isDark
            ? "radial-gradient(circle, rgba(196,140,179,0.15) 0%, transparent 70%)"
            : "radial-gradient(circle, rgba(196,140,179,0.1) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      {/* Header Section */}
      <Box sx={{ p: 3, pb: 2, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          {isMobile && (
            <IconButton
              onClick={handleSidebarToggle}
              sx={{
                color: isDark ? "#E8B4D9" : "#C48CB3",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1 }}>
          {navItems.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
              <NavLink
                to={item.path}
                style={{ textDecoration: "none", width: "100%" }}
                onClick={() => setSidebarOpen(false)}
              >
                {({ isActive }) => (
                  <ListItemButton
                    sx={{
                      borderRadius: "12px",
                      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                      background: isActive
                        ? isDark
                          ? "rgba(196,140,179,0.2)"
                          : "rgba(196,140,179,0.15)"
                        : "transparent",
                      border: isActive
                        ? `2px solid ${primaryColor}`
                        : "2px solid transparent",
                      "&:hover": {
                        transform: "translateX(4px)",
                        background: isDark
                          ? "rgba(196,140,179,0.15)"
                          : "rgba(196,140,179,0.1)",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: isActive
                          ? primaryColor
                          : isDark
                          ? "#E8B4D9"
                          : "#A86B97",
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: "14px",
                        color: isActive
                          ? primaryColor
                          : isDark
                          ? "#FFFFFF"
                          : "#000000",
                      }}
                    />
                  </ListItemButton>
                )}
              </NavLink>
            </ListItem>
          ))}

          {/* AI Services Dropdown */}
          <ListItem disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              onClick={() => setAiOpen(!aiOpen)}
              sx={{
                borderRadius: "12px",
                transition: "all 0.3s ease",
                background: aiOpen
                  ? isDark
                    ? "rgba(196,140,179,0.15)"
                    : "rgba(196,140,179,0.1)"
                  : "transparent",
                "&:hover": {
                  background: isDark
                    ? "rgba(196,140,179,0.15)"
                    : "rgba(196,140,179,0.1)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: isDark ? "#E8B4D9" : "#A86B97",
                  minWidth: 40,
                }}
              >
                <PsychologyIcon />
              </ListItemIcon>
              <ListItemText
                primary="AI Services"
                primaryTypographyProps={{ fontWeight: 600, fontSize: "14px" }}
              />
              {aiOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
          </ListItem>

          <Collapse in={aiOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {aiServices.map((service) => (
                <ListItem
                  key={service.path}
                  disablePadding
                  sx={{ mb: 0.5, pl: 2 }}
                >
                  <NavLink
                    to={`ai/${service.path}`}
                    style={{ textDecoration: "none", width: "100%" }}
                    onClick={() => setSidebarOpen(false)}
                  >
                    {({ isActive }) => (
                      <ListItemButton
                        sx={{
                          borderRadius: "10px",
                          transition: "all 0.3s ease",
                          background: isActive
                            ? isDark
                              ? "rgba(196,140,179,0.15)"
                              : "rgba(196,140,179,0.1)"
                            : "transparent",
                          "&:hover": {
                            transform: "translateX(4px)",
                            background: isDark
                              ? "rgba(196,140,179,0.1)"
                              : "rgba(196,140,179,0.05)",
                          },
                        }}
                      >
                        <ListItemIcon
                          sx={{
                            color: isActive
                              ? primaryColor
                              : isDark
                              ? "#E8B4D9"
                              : "#A86B97",
                            minWidth: 35,
                          }}
                        >
                          {service.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={service.label}
                          primaryTypographyProps={{
                            fontWeight: 500,
                            fontSize: "13px",
                            color: isActive
                              ? primaryColor
                              : isDark
                              ? "#E5E7EB"
                              : "#6B7280",
                          }}
                        />
                      </ListItemButton>
                    )}
                  </NavLink>
                </ListItem>
              ))}
            </List>
          </Collapse>

          {/* Logout */}
          <ListItem disablePadding sx={{ mt: 1 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: "12px",
                mt: 0.5,
                mb: 0.5,
                transition: "all 0.3s ease",
                background: isDark
                  ? "rgba(248,113,113,0.08)"
                  : "rgba(248,113,113,0.06)",
                "&:hover": {
                  background: isDark
                    ? "rgba(248,113,113,0.18)"
                    : "rgba(248,113,113,0.16)",
                  transform: "translateX(4px)",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "#ef4444",
                  minWidth: 40,
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#ef4444",
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        background: isDark
          ? "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 100%)"
          : "linear-gradient(135deg, #F8FAFC 0%, #FFFFFF 100%)",
      }}
    >
      {/* Top Navigation Bar */}
      <AppBar
        position="fixed"
        sx={{
          background: isDark
            ? "rgba(26, 26, 26, 0.95)"
            : "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(20px)",
          boxShadow: isDark
            ? "0 2px 20px rgba(0,0,0,0.3)"
            : "0 2px 20px rgba(0,0,0,0.1)",
          borderBottom: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.05)",
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", px: { xs: 2, sm: 3 } }}>
          {/* Left Section - Menu Button and Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton
              color="inherit"
              onClick={handleSidebarToggle}
              sx={{
                color: isDark ? "#E8B4D9" : "#C48CB3",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  transform: "scale(1.05)",
                },
                transition: "all 0.3s ease",
              }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <WorkOutlineIcon
                sx={{
                  color: isDark ? "#E8B4D9" : "#C48CB3",
                  fontSize: "1.5rem",
                }}
              />
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
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                CareerHive
              </Typography>
            </Box>
          </Box>

          {/* Right Section - User Info + Theme Toggle */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {userName && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.2,
                  pr: { xs: 0, sm: 1 },
                }}
              >
                {/* Avatar بحروف الاسم */}
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: isDark
                      ? "linear-gradient(135deg, #E8B4D9 0%, #FF6B9D 100%)"
                      : "linear-gradient(135deg, #C48CB3 0%, #D81B60 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: isDark ? "#020617" : "#FFFFFF",
                    boxShadow: isDark
                      ? "0 4px 14px rgba(0,0,0,0.7)"
                      : "0 4px 14px rgba(148,27,96,0.35)",
                    textTransform: "uppercase",
                  }}
                >
                  {userName
                    .split(" ")
                    .filter(Boolean)
                    .map((part) => part[0])
                    .join("")
                    .slice(0, 2)}
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    lineHeight: 1.1,
                  }}
                >
                  <Typography
                    variant="caption"
                    sx={{
                      color: isDark
                        ? "rgba(248,250,252,0.7)"
                        : "rgba(15,23,42,0.7)",
                      fontSize: "0.7rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                    }}
                  >
                    Signed in as
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 600,
                      fontSize: "0.9rem",
                      color: isDark ? "#F9FAFB" : "#111827",
                      maxWidth: 160,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {userName}
                  </Typography>
                </Box>
              </Box>
            )}

            <IconButton
              onClick={() => dispatch(toggleTheme())}
              sx={{
                color: isDark ? "#E8B4D9" : "#C48CB3",
                background: isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.02)",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.05)",
                  transform: "scale(1.1) rotate(15deg)",
                },
              }}
            >
              {isDark ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant="temporary"
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ModalProps={{
          keepMounted: true,
          BackdropProps: {
            sx: { backgroundColor: "transparent" }, // بدون تعتيم
          },
        }}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            top: { xs: 56, sm: 64 },
            height: { xs: "calc(100% - 56px)", sm: "calc(100% - 64px)" },
            border: "none",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          mt: { xs: 7, sm: 8 },
          ml: 0,
          transition: "margin-left 0.3s ease",
          minHeight: "calc(100vh - 64px)",
        }}
      >
        <Outlet context={{ applications, setApplications, loading }} />
      </Box>
    </Box>
  );
}
