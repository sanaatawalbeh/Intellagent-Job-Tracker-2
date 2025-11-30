// src/components/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Typography,
  Avatar,
  Paper,
  Button,
} from "@mui/material";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
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

  if (!user) return null;

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        py: 4,
      }}
    >
      <Paper
        elevation={isDark ? 0 : 4}
        sx={{
          p: 4,
          borderRadius: "20px",
          textAlign: "center",
          width: 350,
          boxShadow: isDark
            ? "0 10px 25px rgba(0,0,0,0.6)"
            : "0 10px 25px rgba(15,23,42,0.15)",
          background: isDark
            ? "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(30,41,59,0.95))"
            : "linear-gradient(145deg, #ffffff, #fdf4fa)",
          border: isDark
            ? "1px solid rgba(248,250,252,0.08)"
            : "1px solid rgba(148,163,184,0.25)",
        }}
      >
        <Avatar
          src={`https://ui-avatars.com/api/?name=${
            userData?.username || "User"
          }&background=${primaryColor.replace("#", "")}&color=fff&size=120`}
          alt="Profile Avatar"
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: `4px solid ${primaryColor}`,
            mx: "auto",
            boxShadow: isDark
              ? "0 8px 20px rgba(0,0,0,0.7)"
              : "0 8px 20px rgba(0,0,0,0.25)",
          }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
          gutterBottom
          sx={{
            letterSpacing: "0.5px",
            color: isDark ? "#E5E7EB" : "#031716",
          }}
        >
          {userData?.username || "User"}
        </Typography>

        <Typography
          variant="body1"
          gutterBottom
          sx={{
            mb: 3,
            color: isDark ? "rgba(209,213,219,0.8)" : "text.secondary",
          }}
        >
          {user.email}
        </Typography>

        <Box mt={2}>
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              borderRadius: "20px",
              px: 4,
              py: 1.5,
              fontSize: "16px",
              fontWeight: 600,
              background: isDark
                ? "linear-gradient(90deg, #f97373, #fb7185)"
                : "linear-gradient(90deg, #ef4444, #f97373)",
              color: "#fff",
              transition: "all 0.3s ease",
              boxShadow: isDark
                ? "0 6px 16px rgba(248,113,113,0.4)"
                : "0 6px 16px rgba(248,113,113,0.35)",
              "&:hover": {
                transform: "scale(1.05)",
                background: isDark
                  ? "linear-gradient(90deg, #fb7185, #f97373)"
                  : "linear-gradient(90deg, #f97373, #ef4444)",
                boxShadow: isDark
                  ? "0 8px 20px rgba(248,113,113,0.6)"
                  : "0 8px 20px rgba(248,113,113,0.5)",
              },
            }}
          >
            Logout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
