import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Chip,
  CircularProgress,
  Alert,
  Fade,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Psychology,
  AutoFixHigh,
  TrendingUp,
  Warning,
  Clear,
} from "@mui/icons-material";

export default function ResumeFeedback() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  const handleClearText = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) {
      setError("Please enter your resume text");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(
        "https://intellagent-job-tracker-2.onrender.com/api/resume-feedback",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }
      );

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
      color: isDark ? "#FFFFFF" : "#000000",
    },
    "& .MuiInputLabel-root": {
      color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
    },
    "& .MuiOutlinedInput-input": {
      color: isDark ? "#FFFFFF" : "#000000",
      "&::placeholder": {
        color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.4)",
      },
    },
  };

  const sectionIcons = {
    grammar: <AutoFixHigh />,
    strengths: <TrendingUp />,
    weaknesses: <Warning />,
    keywords: <Psychology />,
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Psychology
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
          AI Resume Feedback
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Get instant AI-powered feedback to improve your resume
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
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Paste your resume text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={8}
            fullWidth
            required
            sx={textFieldSx}
            InputProps={{
              endAdornment: text && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClearText}
                    sx={{
                      color: isDark
                        ? "rgba(255,255,255,0.5)"
                        : "rgba(0,0,0,0.4)",
                      "&:hover": {
                        color: isDark ? "#FFFFFF" : "#000000",
                      },
                    }}
                  >
                    <Clear />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !text.trim()}
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
                  color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
              ) : (
                "Analyze Resume"
              )}
            </Button>

            {error && (
              <Alert
                severity="error"
                sx={{
                  flex: 1,
                  background: isDark ? "rgba(211,47,47,0.1)" : undefined,
                  color: isDark ? "#ff5252" : undefined,
                }}
              >
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
              {[
                { key: "grammar", title: "Grammar & Style" },
                { key: "strengths", title: "Strengths" },
                { key: "weaknesses", title: "Areas for Improvement" },
                { key: "keywords", title: "Suggested Keywords" },
              ].map((section) => (
                <Grid item xs={12} md={6} key={section.key}>
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
                        {sectionIcons[section.key]}
                      </Box>
                      <Typography
                        variant="h6"
                        fontWeight={600}
                        sx={{
                          color: isDark ? "#FFFFFF" : "#000000",
                        }}
                      >
                        {section.title}
                      </Typography>
                    </Box>

                    {section.key === "keywords" ? (
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
                        ) : (
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDark
                                ? "rgba(255,255,255,0.7)"
                                : "rgba(0,0,0,0.6)",
                            }}
                          >
                            {String(result.keywords || "No keywords suggested")}
                          </Typography>
                        )}
                      </Box>
                    ) : (
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
                        {Array.isArray(result[section.key]) ? (
                          result[section.key].map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : typeof result[section.key] === "object" &&
                          result[section.key] !== null ? (
                          Object.values(result[section.key]).map((item, i) => (
                            <li key={i}>{item}</li>
                          ))
                        ) : (
                          <li>{String(result[section.key] || "No data")}</li>
                        )}
                      </Box>
                    )}
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>
      )}
    </Container>
  );
}
