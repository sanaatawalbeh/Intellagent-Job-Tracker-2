import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  LinearProgress,
  Grid,
  Alert,
  Fade,
} from "@mui/material";
import { Work, Psychology, TrendingUp, AutoFixHigh } from "@mui/icons-material";

export default function JobAnalyzer() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter a job description");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/job-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data?.error || `Request failed with status ${res.status}`;
        throw new Error(msg);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

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

  const getSuitabilityColor = (score) => {
    if (score >= 80) return "#4CAF50";
    if (score >= 60) return "#FFC107";
    return "#f44336";
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Work
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
          AI Job Analyzer
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Analyze job descriptions and find the best opportunities
        </Typography>
      </Box>

      {/* Input Form */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: "16px",
          background: isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FDFCFD 100%)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Paste job description here..."
            multiline
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            required
            sx={textFieldSx}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "12px",
                px: 4,
                py: 1.2,
                fontSize: "16px",
                fontWeight: 600,
                background: isDark
                  ? "linear-gradient(135deg, #C48CB3 0%, #E8B4D9 100%)"
                  : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)",
                boxShadow: "0 4px 15px rgba(196,140,179,0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(196,140,179,0.4)",
                },
                "&:disabled": {
                  background: isDark
                    ? "rgba(255,255,255,0.1)"
                    : "rgba(0,0,0,0.1)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Analyze Job"
              )}
            </Button>

            {error && (
              <Alert severity="error" sx={{ flex: 1 }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Paper>

      {/* Results */}
      {result && (
        <Fade in={true} timeout={500}>
          <Box>
            <Typography
              variant="h5"
              fontWeight={700}
              sx={{
                color: isDark ? "#FFFFFF" : "#000000",
                mb: 3,
                textAlign: "center",
              }}
            >
              Analysis Results
            </Typography>

            <Grid container spacing={3}>
              {/* Required Skills */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.8)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        background: `${primaryColor}20`,
                        color: primaryColor,
                        mr: 2,
                      }}
                    >
                      <Psychology />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color: isDark ? "#FFFFFF" : "#000000",
                      }}
                    >
                      Required Skills
                    </Typography>
                  </Box>

                  <Box
                    component="ul"
                    sx={{
                      pl: 2,
                      m: 0,
                      "& li": {
                        color: isDark
                          ? "rgba(255,255,255,0.8)"
                          : "rgba(0,0,0,0.8)",
                        mb: 0.5,
                        lineHeight: 1.6,
                      },
                    }}
                  >
                    {Array.isArray(result.skills) ? (
                      result.skills.map((s, i) => <li key={i}>{s}</li>)
                    ) : typeof result.skills === "object" &&
                      result.skills !== null ? (
                      Object.values(result.skills).map((s, i) => (
                        <li key={i}>{s}</li>
                      ))
                    ) : (
                      <li>{String(result.skills || "No skills identified")}</li>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Keywords */}
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.8)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    height: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        background: `${primaryColor}20`,
                        color: primaryColor,
                        mr: 2,
                      }}
                    >
                      <AutoFixHigh />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color: isDark ? "#FFFFFF" : "#000000",
                      }}
                    >
                      Keywords
                    </Typography>
                  </Box>

                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Array.isArray(result.keywords) ? (
                      result.keywords.map((k, i) => (
                        <Chip
                          key={i}
                          label={k}
                          size="small"
                          sx={{
                            background: isDark
                              ? "rgba(196,140,179,0.2)"
                              : "rgba(196,140,179,0.1)",
                            color: isDark ? "#E8B4D9" : "#A86B97",
                            fontWeight: 500,
                            border: `1px solid ${primaryColor}40`,
                          }}
                        />
                      ))
                    ) : typeof result.keywords === "object" &&
                      result.keywords !== null ? (
                      Object.values(result.keywords).map((k, i) => (
                        <Chip
                          key={i}
                          label={k}
                          size="small"
                          sx={{
                            background: isDark
                              ? "rgba(196,140,179,0.2)"
                              : "rgba(196,140,179,0.1)",
                            color: isDark ? "#E8B4D9" : "#A86B97",
                            fontWeight: 500,
                          }}
                        />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDark
                            ? "rgba(255,255,255,0.7)"
                            : "rgba(0,0,0,0.6)",
                        }}
                      >
                        {String(result.keywords || "No keywords identified")}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>

              {/* Suitability Score */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "16px",
                    background: isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(255,255,255,0.8)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "10px",
                        background: `${primaryColor}20`,
                        color: primaryColor,
                        mr: 2,
                      }}
                    >
                      <TrendingUp />
                    </Box>
                    <Typography
                      variant="h6"
                      fontWeight={600}
                      sx={{
                        color: isDark ? "#FFFFFF" : "#000000",
                      }}
                    >
                      Suitability Score
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <LinearProgress
                      variant="determinate"
                      value={result.suitability || 0}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        background: isDark
                          ? "rgba(255,255,255,0.1)"
                          : "rgba(0,0,0,0.1)",
                        "& .MuiLinearProgress-bar": {
                          background: getSuitabilityColor(
                            result.suitability || 0
                          ),
                          borderRadius: 6,
                        },
                      }}
                    />
                  </Box>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{
                      color: getSuitabilityColor(result.suitability || 0),
                      textAlign: "center",
                    }}
                  >
                    {result.suitability || 0}%
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.6)",
                      textAlign: "center",
                      mt: 1,
                    }}
                  >
                    Based on skills match and requirements
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Fade>
      )}
    </Container>
  );
}
