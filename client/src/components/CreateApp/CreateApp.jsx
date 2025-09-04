import { useState } from "react";
import { db, auth } from "../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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

export default function CreateApp() {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [status, setStatus] = useState("applied");

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
        title: "Application Added",
        icon: "success",
        confirmButtonColor: "#C48CB3",
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
      borderRadius: "10px",
      "&.Mui-focused fieldset": {
        borderColor: "#C48CB3",
        borderWidth: "2px",
      },
    },
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 4,
          borderRadius: "20px",
          width: "100%",
          maxWidth: 500,
          boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
          background: "linear-gradient(145deg, #fff, #fdf4fa)",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight={700}
          sx={{ mb: 3, color: "#C48CB3" }}
        >
          Add Job Application
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
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
            label="Status"
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
              mt: 1,
              py: 1.5,
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: 600,
              bgcolor: "#C48CB3",
              color: "#fff",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "#9F6496",
                transform: "translateY(-2px)",
                boxShadow: "0 6px 15px rgba(0,0,0,0.3)",
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
