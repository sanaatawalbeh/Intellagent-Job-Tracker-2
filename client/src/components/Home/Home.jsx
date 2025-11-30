import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
import {
  AccountCircle,
  Analytics,
  Assignment,
  Edit,
} from "@mui/icons-material";

export default function Home() {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  const features = [
    {
      icon: <AccountCircle sx={{ fontSize: 50, color: primaryColor, mb: 1 }} />,
      title: "Profile Management",
      description: "View and edit your profile easily.",
      gradient: isDark
        ? "linear-gradient(145deg, #2D1B2E, #3A2442)"
        : "linear-gradient(145deg, #FFE4EC, #FFD6E8)",
    },
    {
      icon: <Assignment sx={{ fontSize: 50, color: primaryColor, mb: 1 }} />,
      title: "Track Applications",
      description: "Study your job applications and statuses in one place.",
      gradient: isDark
        ? "linear-gradient(145deg, #2A1A2C, #35213A)"
        : "linear-gradient(145deg, #FFD6E8, #FFC1D9)",
    },
    {
      icon: <Analytics sx={{ fontSize: 50, color: primaryColor, mb: 1 }} />,
      title: "AI Insights",
      description:
        "Get AI-generated insights and statistics about your applications.",
      gradient: isDark
        ? "linear-gradient(145deg, #2C1B2A, #372133)"
        : "linear-gradient(145deg, #FFD1B8, #FFE0CC)",
    },
    {
      icon: <Edit sx={{ fontSize: 50, color: primaryColor, mb: 1 }} />,
      title: "AI Resume Help",
      description: "Improve your resume with AI suggestions.",
      gradient: isDark
        ? "linear-gradient(145deg, #2D1C2D, #382438)"
        : "linear-gradient(145deg, #EFD1F2, #FFD6EB)",
    },
  ];

  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        mb: 8,
        background: isDark
          ? "linear-gradient(135deg, #0F0F0F 0%, #1A1A1A 50%, #0F0F0F 100%)"
          : "linear-gradient(135deg, #FFFFFF 0%, #FAF5FF 50%, #FFFFFF 100%)",
      }}
    >
      {/* Hero Section */}
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          minHeight: "40vh",
          py: 3,
          background: isDark
            ? "radial-gradient(circle at center, rgba(196,140,179,0.1) 0%, transparent 50%)"
            : "radial-gradient(circle at center, rgba(196,140,179,0.08) 0%, transparent 50%)",
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            fontSize: { xs: "28px", md: "56px" },
            color: isDark ? "#FFFFFF" : "#111827",
            mt: 20,
            textShadow: isDark ? "0 4px 8px rgba(0,0,0,0.3)" : "none",
          }}
        >
          Find your{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              px: 1.5,
              borderRadius: "0.5em",
              background: isDark
                ? "linear-gradient(135deg, #C48CB3 0%, #D8A8C8 100%)"
                : "linear-gradient(135deg, #C48CB3 0%, #B87CA5 100%)",
              color: "#FFFFFF",
              boxShadow: isDark
                ? "0 6px 20px rgba(196,140,179,0.4)"
                : "0 6px 20px rgba(196,140,179,0.25)",
              transform: "skew(-5deg)",
            }}
          >
            dream jobs
          </Box>{" "}
          <br />
          in{" "}
          <Box
            component="span"
            sx={{
              background: isDark
                ? "linear-gradient(135deg, #E8B4D9 0%, #D8A8C8 100%)"
                : "linear-gradient(135deg, #A86B97 0%, #8A4C7A 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontWeight: 900,
            }}
          >
            New Castle
          </Box>
        </Typography>
      </Box>

      {/* Register / Login Buttons */}
      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button
          component={RouterLink}
          to="/register"
          variant="contained"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "25px",
            fontWeight: 600,
            fontSize: "18px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            background: isDark
              ? "linear-gradient(135deg, #C48CB3 0%, #D8A8C8 100%)"
              : "linear-gradient(135deg, #C48CB3 0%, #B87CA5 100%)",
            boxShadow: isDark
              ? "0 8px 25px rgba(196,140,179,0.4)"
              : "0 8px 25px rgba(196,140,179,0.3)",
            "&:hover": {
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: isDark
                ? "0 12px 35px rgba(196,140,179,0.5)"
                : "0 12px 35px rgba(196,140,179,0.4)",
              background: isDark
                ? "linear-gradient(135deg, #D8A8C8 0%, #C48CB3 100%)"
                : "linear-gradient(135deg, #B87CA5 0%, #C48CB3 100%)",
            },
          }}
        >
          Register
        </Button>

        <Button
          component={RouterLink}
          to="/login"
          variant="outlined"
          size="large"
          sx={{
            px: 4,
            py: 1.5,
            borderRadius: "25px",
            fontWeight: 600,
            fontSize: "18px",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            color: primaryColor,
            borderColor: primaryColor,
            borderWidth: "2px",
            background: isDark ? "rgba(196,140,179,0.05)" : "transparent",
            "&:hover": {
              background: isDark
                ? "rgba(196,140,179,0.15)"
                : "rgba(196,140,179,0.08)",
              borderColor: isDark ? "#D8A8C8" : "#B87CA5",
              color: isDark ? "#E8B4D9" : "#A86B97",
              transform: "translateY(-3px) scale(1.05)",
              boxShadow: isDark
                ? "0 8px 25px rgba(196,140,179,0.3)"
                : "0 8px 25px rgba(196,140,179,0.2)",
              borderWidth: "2px",
            },
          }}
        >
          Login
        </Button>
      </Box>

      {/* Features Section */}
      <Box sx={{ mt: 8, width: "100%" }}>
        <Typography
          variant="h4"
          fontWeight={700}
          sx={{
            mb: 4,
            background: isDark
              ? "linear-gradient(135deg, #E8B4D9 0%, #D8A8C8 100%)"
              : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textAlign: "center",
            fontSize: { xs: "2rem", md: "2.5rem" },
          }}
        >
          Features
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "20px",
                  textAlign: "center",
                  background: feature.gradient,
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  border: isDark
                    ? "1px solid rgba(255,255,255,0.1)"
                    : "1px solid rgba(0,0,0,0.05)",
                  boxShadow: isDark
                    ? "0 8px 25px rgba(0,0,0,0.3)"
                    : "0 8px 25px rgba(0,0,0,0.1)",
                  "&:hover": {
                    transform: "translateY(-8px) scale(1.02)",
                    boxShadow: isDark
                      ? "0 20px 40px rgba(196,140,179,0.3)"
                      : "0 20px 40px rgba(196,140,179,0.2)",
                  },
                }}
              >
                {feature.icon}
                <Typography
                  variant="h6"
                  fontWeight={600}
                  gutterBottom
                  sx={{
                    color: isDark ? "#FFFFFF" : "#111827",
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: isDark ? "#D1D5DB" : "#6B7280",
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Additional CTA Section */}
      <Box sx={{ mt: 8, textAlign: "center" }}>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 600,
            color: isDark ? "#E5E7EB" : "#374151",
            mb: 2,
          }}
        >
          Ready to start your journey?
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "#9CA3AF" : "#6B7280",
            mb: 3,
            maxWidth: 600,
          }}
        >
          Join thousands of professionals who found their dream jobs through
          CareerHive
        </Typography>
      </Box>
    </Container>
  );
}
