import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { auth, db } from "../../firebase";
import Swal from "sweetalert2";
import {
  Box,
  Button,
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

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ بديل عن window.location.hash
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = async () => {
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
        width: 350,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        p: 2,
        bgcolor: "#C48CB3",
        color: "#fff",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={700}
        sx={{ mb: 4, textAlign: "start" }}
      >
        JobTracker
      </Typography>

      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <NavLink
              to={item.path}
              style={{ textDecoration: "none", color: "#fff", width: "100%" }}
              onClick={() => setMobileOpen(false)}
            >
              {({ isActive }) => (
                <ListItemButton
                  sx={{
                    borderRadius: "12px",
                    mx: 1,
                    mb: 1,
                    transition: "all 0.3s",
                    backgroundColor: isActive
                      ? "rgba(255,255,255,0.15)"
                      : "transparent",
                    "&:hover": {
                      transform: "scale(1.05)",
                      backgroundColor: "rgba(255,255,255,0.15)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontWeight: 600,
                      fontSize: "16px",
                    }}
                  />
                </ListItemButton>
              )}
            </NavLink>
          </ListItem>
        ))}

        {/* 🔹 AI Services Dropdown */}
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setAiOpen(!aiOpen)}
            sx={{
              borderRadius: "12px",
              mx: 1,
              mb: 1,
              bgcolor: aiOpen ? "rgba(255,255,255,0.15)" : "transparent",
            }}
          >
            <ListItemText
              primary="AI Services"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "16px" }}
            />
            {aiOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
        </ListItem>

        {aiOpen &&
          aiServices.map((service) => (
            <ListItem key={service.path} disablePadding sx={{ pl: 4 }}>
              <NavLink
                to={`ai/${service.path}`}
                style={{ textDecoration: "none", color: "#fff", width: "100%" }}
                onClick={() => setMobileOpen(false)}
              >
                {({ isActive }) => (
                  <ListItemButton
                    sx={{
                      borderRadius: "12px",
                      mx: 1,
                      mb: 1,
                      transition: "all 0.3s",
                      backgroundColor: isActive
                        ? "rgba(255,255,255,0.15)"
                        : "transparent",
                      "&:hover": {
                        transform: "scale(1.05)",
                        backgroundColor: "rgba(255,255,255,0.15)",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: "white" }}>
                      {service.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={service.label}
                      primaryTypographyProps={{
                        fontWeight: 600,
                        fontSize: "15px",
                      }}
                    />
                  </ListItemButton>
                )}
              </NavLink>
            </ListItem>
          ))}
      </List>

      <Button
        variant="contained"
        onClick={handleLogout}
        startIcon={<LogoutIcon />}
        sx={{
          mt: "auto",
          borderRadius: "12px",
          py: 1.5,
          px: 3,
          fontSize: "16px",
          fontWeight: 600,
          bgcolor: "#C48CB3",
          alignSelf: "flex-start",
          ml: 2,
          "&:hover": {
            bgcolor: "#9F6496",
            transform: "scale(1.05)",
          },
        }}
      >
        Logout
      </Button>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f8fafc" }}>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "#C48CB3",
          display: { xs: "block", sm: "none" },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            JobTracker Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 280 },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 325 },
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          mt: { xs: 7, sm: 0 },
        }}
      >
        <Outlet context={{ applications, setApplications, loading }} />
      </Box>
    </Box>
  );
}
