import React, { useState } from "react";
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
} from "@mui/material";

export default function ResumeFeedback() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("http://localhost:5000/api/resume-feedback", {
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

  return (
    <Box
      sx={{
        minHeight: "100vh",
        ml: { sm: "36.2px" },
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
          sx={{ color: "#C48CB3" }}
        >
          Resume Feedback
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
          <TextField
            label="Paste your resume text here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            multiline
            rows={10}
            fullWidth
            required
            sx={{
              "& label.Mui-focused": { color: "#C48CB3" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#C48CB3" },
                "&:hover fieldset": { borderColor: "#9F6496" },
                "&.Mui-focused fieldset": { borderColor: "#C48CB3" },
                width: 1000,
              },
            }}
          />

          <Box mt={2} display="flex" alignItems="center" gap={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "16px",
                bgcolor: "#C48CB3",
                width: 250,
                ml: "40%",

                "&:hover": { bgcolor: "#9F6496" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#C48CB3" }} />
              ) : (
                "Analyze Resume"
              )}
            </Button>
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}
          </Box>
        </Box>

        {result && (
          <Box
            sx={{
              p: 3,
              borderRadius: "20px",
              bgcolor: "#C48CB3",
              display: "grid",
              gap: 3,
              width: 1000,
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#fff", textAlign: "center" }}
            >
              AI Result
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #C48CB3",
                    bgcolor: "#fff", // خلفية بيضاء داخل كل Paper
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#C48CB3" }}
                  >
                    Grammar
                  </Typography>
                  <ul>
                    {Array.isArray(result.grammar) ? (
                      result.grammar.map((g, i) => <li key={i}>{g}</li>)
                    ) : typeof result.grammar === "object" &&
                      result.grammar !== null ? (
                      Object.values(result.grammar).map((g, i) => (
                        <li key={i}>{g}</li>
                      ))
                    ) : (
                      <li>{String(result.grammar || "—")}</li>
                    )}
                  </ul>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #C48CB3",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#C48CB3" }}
                  >
                    Strengths
                  </Typography>
                  <ul>
                    {Array.isArray(result.strengths) ? (
                      result.strengths.map((g, i) => <li key={i}>{g}</li>)
                    ) : (
                      <li>{String(result.strengths || "—")}</li>
                    )}
                  </ul>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #C48CB3",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#C48CB3" }}
                  >
                    Weaknesses
                  </Typography>
                  <ul>
                    {Array.isArray(result.weaknesses) ? (
                      result.weaknesses.map((g, i) => <li key={i}>{g}</li>)
                    ) : (
                      <li>{String(result.weaknesses || "—")}</li>
                    )}
                  </ul>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #C48CB3",
                    bgcolor: "#fff",
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: "#C48CB3" }}
                  >
                    Suggested Keywords
                  </Typography>
                  <Box display="flex" flexWrap="wrap" gap={1}>
                    {Array.isArray(result.keywords) ? (
                      result.keywords.map((k, i) => (
                        <Chip
                          key={i}
                          label={k}
                          variant="outlined"
                          sx={{
                            borderColor: "#C48CB3",
                            color: "#C48CB3",
                            fontWeight: 500,
                          }}
                        />
                      ))
                    ) : (
                      <Typography variant="body2">
                        {String(result.keywords || "—")}
                      </Typography>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}
