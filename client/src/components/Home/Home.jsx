import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Typography, Container, Grid, Paper } from "@mui/material";
import {
  AccountCircle,
  Analytics,
  Assignment,
  Edit,
} from "@mui/icons-material";

export default function Home() {
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
      }}
    >
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          minHeight: "40vh",
          py: 3,
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            fontSize: { xs: "28px", md: "56px" },
            color: "text.primary",
            mt:20,
          }}
        >
          Find your{" "}
          <Box
            component="span"
            sx={{
              display: "inline-block",
              px: 1.5,
              borderRadius: "0.5em",
              bgcolor: "#C48CB3",
              color: "#fff",
              boxShadow: "0 6px 20px rgba(59,130,246,0.25)",
            }}
          >
            dream jobs
          </Box>{" "}
          <br />
          in{" "}
          <Box
            component="span"
            sx={{
              color: "text.secondary",
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
            transition: "0.3s",
            bgcolor: "#C48CB3",
            "&:hover": { transform: "scale(1.05)" },
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
            transition: "0.3s",
            color: "#C48CB3",
            borderColor: "#C48CB3",
            "&:hover": {
              bgcolor: "#C48CB3",
              color: "#fff",
              transform: "scale(1.05)",
              borderColor: "#C48CB3",
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
          sx={{ mb: 4, color: "#C48CB3", textAlign: "center" }}
        >
          Features
        </Typography>

        <Grid container spacing={4} justifyContent="center">
          {/* Feature 1 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: "linear-gradient(145deg, #FFE4EC, #FFD6E8)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              <AccountCircle sx={{ fontSize: 50, color: "#C48CB3", mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Profile Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                View and edit your profile easily.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 2 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: "linear-gradient(145deg, #FFD6E8, #FFC1D9)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Assignment sx={{ fontSize: 50, color: "#C48CB3", mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Track Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Study your job applications and statuses in one place.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 3 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: "linear-gradient(145deg, #FFD1B8, #FFE0CC)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Analytics sx={{ fontSize: 50, color: "#C48CB3", mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Get AI-generated insights and statistics about your
                applications.
              </Typography>
            </Paper>
          </Grid>

          {/* Feature 4 */}
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: "20px",
                textAlign: "center",
                bgcolor: "linear-gradient(145deg, #EFD1F2, #FFD6EB)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 12px 25px rgba(0,0,0,0.2)",
                },
              }}
            >
              <Edit sx={{ fontSize: 50, color: "#C48CB3", mb: 1 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                AI Resume Help
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Improve your resume with AI suggestions.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
