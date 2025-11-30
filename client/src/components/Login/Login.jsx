import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebase";
import Swal from "sweetalert2";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Link,
  InputAdornment,
  Fade,
} from "@mui/material";
import { Email, Lock, Visibility, VisibilityOff } from "@mui/icons-material";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";
  const accentColor = isDark ? "#FF6B9D" : "#D81B60";

  const firebaseErrorMessages = {
    "auth/invalid-email": "Please enter a valid email address",
    "auth/user-not-found": "No account found with this email",
    "auth/wrong-password": "Incorrect password",
    "auth/too-many-requests": "Too many attempts. Try again later",
    "auth/user-disabled": "This account has been disabled",
    "auth/network-request-failed":
      "Network error. Please check your connection",
  };

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      background: isDark ? "#0A0A0A" : "#FFFFFF",
      color: isDark ? "#FFFFFF" : "#000000",
      confirmButtonColor: primaryColor,
      customClass: {
        popup: isDark ? "dark-swal" : "light-swal",
        confirmButton: "swal-confirm-button",
      },
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const role = docSnap.exists() ? docSnap.data().role : null;

      showAlert("success", "🎉 Welcome Back!", "Login successful");

      setTimeout(() => {
        if (role === "admin") {
          navigate("/admindashboard/admin");
        } else {
          navigate("/dashboard/profile");
        }
      }, 1500);
    } catch (error) {
      const message =
        firebaseErrorMessages[error.code] || "Login failed. Please try again.";
      showAlert("error", "Login Failed", message);
    }
  };

  const textFieldSx = {
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)",
      backdropFilter: "blur(10px)",
      border: "1px solid",
      borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        borderColor: primaryColor,
        background: isDark ? "rgba(255,255,255,0.12)" : "#ffffff",
        transform: "translateY(-2px)",
        boxShadow: isDark
          ? "0 8px 25px rgba(196,140,179,0.2)"
          : "0 8px 25px rgba(196,140,179,0.15)",
      },
      "&.Mui-focused": {
        borderColor: accentColor,
        borderWidth: "2px",
        background: isDark ? "rgba(255,255,255,0.15)" : "#ffffff",
        boxShadow: isDark
          ? `0 0 0 4px rgba(255,107,157,0.2)`
          : `0 0 0 4px rgba(216,27,96,0.1)`,
      },
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
      fontWeight: 500,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: accentColor,
      fontWeight: 600,
    },
    "& .MuiOutlinedInput-input": {
      color: isDark ? "#FFFFFF" : "#000000",
      fontWeight: 500,
      "&::placeholder": {
        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
      },
    },
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "70vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        py: 4,
        // الخلفية الآن شفافة – اللي ظاهر هو باكقراوند الـ Layout
        background: "transparent",
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={isDark ? 0 : 0}
          sx={{
            p: 5,
            borderRadius: "28px",
            width: "100%",
            maxWidth: "450px",
            display: "flex",
            flexDirection: "column",
            gap: 3.5,
            background: isDark
              ? "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.05) 100%)"
              : "rgba(255,255,255,0.95)",
            backdropFilter: "blur(40px)",
            border: isDark
              ? "1px solid rgba(255,255,255,0.15)"
              : "1px solid rgba(255,255,255,0.3)",
            boxShadow: isDark
              ? "0 25px 50px rgba(0,0,0,0.5), 0 10px 20px rgba(196,140,179,0.2), inset 0 1px 0 rgba(255,255,255,0.1)"
              : "0 25px 50px rgba(0,0,0,0.15), 0 10px 20px rgba(196,140,179,0.3), inset 0 1px 0 rgba(255,255,255,0.8)",
            transform: "translateY(0)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              transform: "translateY(-5px)",
              boxShadow: isDark
                ? "0 35px 60px rgba(0,0,0,0.6), 0 15px 30px rgba(196,140,179,0.3), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 35px 60px rgba(0,0,0,0.2), 0 15px 30px rgba(196,140,179,0.4), inset 0 1px 0 rgba(255,255,255,0.8)",
            },
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: "center", mb: 1 }}>
            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                background: isDark
                  ? "linear-gradient(135deg, #E8B4D9 0%, #FF6B9D 50%, #D8A8C8 100%)"
                  : "linear-gradient(135deg, #C48CB3 0%, #D81B60 50%, #A86B97 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "2.5rem", md: "3rem" },
                letterSpacing: "-0.02em",
                mb: 1,
              }}
            >
              Welcome Back
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "rgba(255,255,255,0.8)" : "rgba(0,0,0,0.7)",
                fontWeight: 400,
                fontSize: "1.1rem",
              }}
            >
              Sign in to continue your journey
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
            }}
          >
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Email sx={{ color: primaryColor, fontSize: "1.3rem" }} />
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment
                    position="end"
                    sx={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOff
                        sx={{ color: primaryColor, fontSize: "1.3rem" }}
                      />
                    ) : (
                      <Visibility
                        sx={{ color: primaryColor, fontSize: "1.3rem" }}
                      />
                    )}
                  </InputAdornment>
                ),
              }}
              sx={textFieldSx}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.8,
                borderRadius: "16px",
                fontSize: "1.1rem",
                fontWeight: 700,
                letterSpacing: "0.5px",
                background: isDark
                  ? "linear-gradient(90deg, #C48CB3 0%, #FF6B9D 50%, #E8B4D9 100%)"
                  : "linear-gradient(90deg, #C48CB3 0%, #D81B60 50%, #A86B97 100%)",
                backgroundSize: "200% 100%",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  backgroundPosition: "100% 0",
                  transform: "translateY(-4px)",
                },
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: 0,
                  left: "-100%",
                  width: "100%",
                  height: "100%",
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                  transition: "left 0.6s",
                },
                "&:hover::before": {
                  left: "100%",
                },
              }}
            >
               Sign In
            </Button>
          </Box>

          <Typography
            align="center"
            variant="body1"
            sx={{
              mt: 3,
              color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.7)",
              fontWeight: 500,
              fontSize: "1rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              component={RouterLink}
              to="/register"
              underline="none"
              sx={{
                color: accentColor,
                fontWeight: 700,
                transition: "all 0.3s ease",
                position: "relative",
                "&:hover": {
                  color: primaryColor,
                  "&::after": {
                    width: "100%",
                  },
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -2,
                  left: 0,
                  width: "0%",
                  height: "2px",
                  background: accentColor,
                  transition: "width 0.3s ease",
                },
              }}
            >
              Create Account
            </Link>
          </Typography>
        </Paper>
      </Fade>

      {/* Global Styles فقط للـ SweetAlert */}
      <style>{`
        .dark-swal {
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 20px;
          backdrop-filter: blur(20px);
        }
        .light-swal {
          border: 1px solid rgba(0, 0, 0, 0.1);
          border-radius: 20px;
          backdrop-filter: blur(20px);
        }
        .swal-confirm-button {
          border-radius: 12px !important;
          font-weight: 600 !important;
          padding: 12px 24px !important;
        }
      `}</style>
    </Container>
  );
}
