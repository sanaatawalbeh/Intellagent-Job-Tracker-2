import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import { AddCircle } from "@mui/icons-material";

export default function CreateApp() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        Swal.fire("Oops!", "You must be logged in!", "error");
        return;
      }

      await addDoc(collection(db, "applications"), {
        uid: user.uid,
        company,
        position,
        status,
        createdAt: serverTimestamp(),
      });

      Swal.fire({
        title: "Application Added!",
        text: "Your job application has been saved successfully.",
        icon: "success",
        confirmButtonColor: primaryColor,
        background: isDark ? "#1A1A1A" : "#FFFFFF",
        color: isDark ? "#FFFFFF" : "#000000",
      });

      setCompany("");
      setPosition("");
      setStatus("applied");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "12px",
      background: isDark ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.8)",
      "&:hover fieldset": {
        borderColor: primaryColor,
      },
      "&.Mui-focused fieldset": {
        borderColor: primaryColor,
        borderWidth: "2px",
      },
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    },
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          borderRadius: "20px",
          background: isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FDFCFD 100%)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
          boxShadow: isDark
            ? "0 8px 32px rgba(0,0,0,0.3)"
            : "0 8px 32px rgba(0,0,0,0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <AddCircle
            sx={{
              fontSize: 48,
              color: primaryColor,
              mb: 2,
            }}
          />
          <Typography
            variant="h4"
            fontWeight={700}
            sx={{
              color: isDark ? "#FFFFFF" : "#000000",
              mb: 1,
            }}
          >
            Add Job Application
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
            }}
          >
            Track your job applications and stay organized
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <TextField
            label="Company Name"
            variant="outlined"
            fullWidth
            required
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            sx={textFieldSx}
          />

          <TextField
            label="Position / Job Title"
            variant="outlined"
            fullWidth
            required
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            sx={textFieldSx}
          />

          <TextField
            select
            label="Application Status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            fullWidth
            sx={textFieldSx}
          >
            <MenuItem value="applied">Applied</MenuItem>
            <MenuItem value="interview">Interview</MenuItem>
            <MenuItem value="accepted">Accepted</MenuItem>
            <MenuItem value="rejected">Rejected</MenuItem>
          </TextField>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              py: 1.5,
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: 600,
              background: isDark
                ? "linear-gradient(135deg, #C48CB3 0%, #E8B4D9 100%)"
                : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
              boxShadow: isDark
                ? "0 4px 15px rgba(196,140,179,0.3)"
                : "0 4px 15px rgba(196,140,179,0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: isDark
                  ? "0 6px 20px rgba(196,140,179,0.4)"
                  : "0 6px 20px rgba(196,140,179,0.3)",
              },
            }}
          >
            Save Application
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
