import React, { useState } from "react";
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
} from "@mui/material";

export default function JobAnalyzer() {
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
          Job Analyzer
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            mb: 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            width:1000
          }}
        >
          <TextField
            label="Paste job description here..."
            multiline
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            fullWidth
            required
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "10px",
                "&.Mui-focused fieldset": {
                  borderColor: "#C48CB3",
                  borderWidth: 2,
                },
              },
            }}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              borderRadius: "16px",
              bgcolor: "#C48CB3",
              width: 250,
              "&:hover": { bgcolor: "#9F6496" },
              alignSelf: "center",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#C48CB3" }} />
            ) : (
              "Analyze Job"
            )}
          </Button>

          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
        </Box>

        {/* {loading && <LinearProgress sx={{ mt: 2, borderRadius: "5px" }} />} */}

        {result && (
          <Box
            sx={{
              p: 3,
              borderRadius: "20px",
              bgcolor: "#C48CB3",
              display: "grid",
              gap: 3,
              width:1000
            }}
          >
            <Typography
              variant="h5"
              fontWeight="bold"
              sx={{ color: "#fff", textAlign: "center" }}
            >
              AI Result
            </Typography>

            {/* Required Skills */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "16px",
                border: "1px solid #C48CB3",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#C48CB3" }}>
                Required Skills
              </Typography>
              <ul>
                {Array.isArray(result.skills) ? (
                  result.skills.map((s, i) => <li key={i}>{s}</li>)
                ) : typeof result.skills === "object" &&
                  result.skills !== null ? (
                  Object.values(result.skills).map((s, i) => (
                    <li key={i}>{s}</li>
                  ))
                ) : (
                  <li>{String(result.skills || "—")}</li>
                )}
              </ul>
            </Paper>

            {/* Keywords */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "16px",
                border: "1px solid #C48CB3",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#C48CB3" }}>
                Keywords
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {Array.isArray(result.keywords) ? (
                  result.keywords.map((k, i) => (
                    <Chip
                      key={i}
                      label={k}
                      variant="outlined"
                      sx={{ borderColor: "#C48CB3", color: "#C48CB3" }}
                    />
                  ))
                ) : typeof result.keywords === "object" &&
                  result.keywords !== null ? (
                  Object.values(result.keywords).map((k, i) => (
                    <Chip
                      key={i}
                      label={k}
                      variant="outlined"
                      sx={{ borderColor: "#C48CB3", color: "#C48CB3" }}
                    />
                  ))
                ) : (
                  <Typography variant="body2">
                    {String(result.keywords || "—")}
                  </Typography>
                )}
              </Box>
            </Paper>

            {/* Suitability */}
            <Paper
              sx={{
                p: 2,
                borderRadius: "16px",
                border: "1px solid #C48CB3",
                bgcolor: "#fff",
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ color: "#C48CB3" }}>
                Suitability
              </Typography>
              <LinearProgress
                variant="determinate"
                value={result.suitability || 0}
                sx={{ height: 10, borderRadius: 5 }}
              />
              <Typography sx={{ mt: 1 }}>
                {result.suitability || 0} / 100
              </Typography>
            </Paper>
          </Box>
        )}
      </Container>
    </Box>
  );
}
