import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import Swal from "sweetalert2";
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
      confirmButtonColor: "#C48CB3",
      cancelButtonColor: "#f66666",
      confirmButtonText: "Yes, logout!",
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
        elevation={8}
        sx={{
          p: 4,
          borderRadius: "20px",
          textAlign: "center",
          width: 350,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          background: "linear-gradient(145deg, #fff, #fdf4fa)",
        }}
      >
        <Avatar
          src={`https://ui-avatars.com/api/?name=${
            userData?.username || "User"
          }&background=C48CB3&color=fff&size=120`}
          alt="Profile Avatar"
          sx={{
            width: 120,
            height: 120,
            mb: 2,
            border: "4px solid #C48CB3",
            mx: "auto",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        />

        <Typography
          variant="h5"
          fontWeight={700}
          color="#031716"
          gutterBottom
          sx={{ letterSpacing: "0.5px" }}
        >
          {userData?.username || "User"}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          gutterBottom
          sx={{ mb: 3 }}
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
              background: "linear-gradient(90deg, #C48CB3, #9F6496)",
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.05)",
                background: "linear-gradient(90deg, #9F6496, #C48CB3)",
                boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
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
