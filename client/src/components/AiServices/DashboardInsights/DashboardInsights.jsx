import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";

export default function DashboardInsights() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [insightLoading, setInsightLoading] = useState(false);
  const [insight, setInsight] = useState(null);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    applied: 0,
    interview: 0,
    accepted: 0,
    rejected: 0,
  });

  useEffect(() => {
    let unsubscribeSnapshot = () => {};
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      setUser(currentUser);

      const q = query(
        collection(db, "applications"),
        where("uid", "==", currentUser.uid)
      );
      unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const apps = snapshot.docs.map((doc) => doc.data());
        const newStats = { applied: 0, interview: 0, accepted: 0, rejected: 0 };
        apps.forEach((app) => {
          if (newStats[app.status] !== undefined) newStats[app.status] += 1;
        });
        setStats(newStats);
        setLoading(false);
        fetchInsight(newStats);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, []);

  const fetchInsight = async (statsData) => {
    setInsightLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5000/api/dashboard-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats: statsData }),
      });
      if (!res.ok) throw new Error("Failed to fetch insight");
      const data = await res.json();
      setInsight(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setInsightLoading(false);
    }
  };

  if (loading) return <Typography>Loading your applications...</Typography>;
  if (!user)
    return <Typography>Please log in to see your insights.</Typography>;

  return (
    <Box sx={{ minHeight: "100vh", ml: { sm: "36.2px" }, py: 4 }}>
      <Container maxWidth="md">
        {/* الكارد الكبير */}
        <Box
          sx={{
            p: 3,
            borderRadius: "20px",
            bgcolor: "#C48CB3",
            display: "flex",
            flexDirection: "column",
            gap: 3,
            width: 1000,
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: "#fff", textAlign: "center" }}
          >
            AI Dashboard Insights
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {Object.entries(stats).map(([key, value]) => (
              <Grid item xs={6} sm={3} key={key}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "16px",
                    border: "1px solid #C48CB3",
                    bgcolor: "#fff",
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#C48CB3", fontWeight: 600 }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {value}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Motivational Insight */}
          <Paper
            sx={{
              p: 3,
              borderRadius: "16px",
              border: "1px solid #C48CB3",
              bgcolor: "#fff",
            }}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "#C48CB3", fontWeight: 600 }}
            >
              Motivational Insight
            </Typography>
            {insightLoading ? (
              <CircularProgress sx={{ color: "#C48CB3" }} />
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Typography>
                {insight?.summary || "No insight available."}
              </Typography>
            )}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}
