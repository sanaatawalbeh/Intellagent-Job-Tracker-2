import React, { useState, useEffect } from "react";
import { auth, db } from "../../../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Card,
  CardContent,
  Fade,
  LinearProgress,
} from "@mui/material";
import {
  Analytics,
  TrendingUp,
  Psychology,
  EmojiEvents,
  Lightbulb,
} from "@mui/icons-material";

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

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

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
      const res = await fetch(
        "https://intellagent-job-tracker-2.onrender.com/api/dashboard-insights",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stats: statsData }),
        }
      );
      if (!res.ok) throw new Error("Failed to fetch insight");
      const data = await res.json();
      setInsight(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setInsightLoading(false);
    }
  };

  const getSuccessRate = () => {
    const total =
      stats.applied + stats.interview + stats.accepted + stats.rejected;
    if (total === 0) return 0;
    return Math.round((stats.accepted / total) * 100);
  };

  const getInterviewRate = () => {
    if (stats.applied === 0) return 0;
    return Math.round((stats.interview / stats.applied) * 100);
  };

  const statIcons = {
    applied: <TrendingUp sx={{ fontSize: 24 }} />,
    interview: <Psychology sx={{ fontSize: 24 }} />,
    accepted: <EmojiEvents sx={{ fontSize: 24 }} />,
    rejected: <Analytics sx={{ fontSize: 24 }} />,
  };

  const statColors = {
    applied: isDark ? "#83A6CE" : "#83A6CE",
    interview: isDark ? "#E5C9D7" : "#E5C9D7",
    accepted: isDark ? "#4CAF50" : "#4CAF50",
    rejected: isDark ? "#f44336" : "#f44336",
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress sx={{ color: primaryColor }} />
      </Box>
    );
  }

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: "center" }}>
        <Typography variant="h6" sx={{ color: isDark ? "#FFFFFF" : "#000000" }}>
          Please log in to see your insights.
        </Typography>
      </Container>
    );
  }

  const totalApplications = Object.values(stats).reduce(
    (sum, count) => sum + count,
    0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Analytics
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
          AI Dashboard Insights
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Smart analytics and personalized recommendations for your job search
        </Typography>
      </Box>

      <Fade in={true} timeout={800}>
        <Box>
          {/* Stats Overview */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {Object.entries(stats).map(([key, value]) => (
              <Grid item xs={6} sm={3} key={key}>
                <Card
                  sx={{
                    borderRadius: "16px",
                    background: isDark
                      ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
                      : "linear-gradient(135deg, #FFFFFF 0%, #FDFCFD 100%)",
                    border: isDark
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "1px solid rgba(0,0,0,0.08)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    textAlign: "center",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        mb: 2,
                      }}
                    >
                      <Box
                        sx={{
                          p: 1,
                          borderRadius: "12px",
                          background: `${statColors[key]}20`,
                          color: statColors[key],
                        }}
                      >
                        {statIcons[key]}
                      </Box>
                    </Box>
                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{
                        color: isDark ? "#FFFFFF" : "#000000",
                        mb: 1,
                      }}
                    >
                      {value}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(0,0,0,0.6)",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      {key}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Performance Metrics */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
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
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    mb: 2,
                  }}
                >
                  Success Rate
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getSuccessRate()}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      background: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background:
                          getSuccessRate() >= 50 ? "#4CAF50" : "#FFC107",
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: getSuccessRate() >= 50 ? "#4CAF50" : "#FFC107",
                    textAlign: "center",
                  }}
                >
                  {getSuccessRate()}%
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper
                sx={{
                  p: 3,
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
                <Typography
                  variant="h6"
                  fontWeight={600}
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    mb: 2,
                  }}
                >
                  Interview Conversion
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={getInterviewRate()}
                    sx={{
                      height: 12,
                      borderRadius: 6,
                      background: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                      "& .MuiLinearProgress-bar": {
                        background:
                          getInterviewRate() >= 30 ? "#4CAF50" : "#2196F3",
                        borderRadius: 6,
                      },
                    }}
                  />
                </Box>
                <Typography
                  variant="h4"
                  fontWeight={700}
                  sx={{
                    color: getInterviewRate() >= 30 ? "#4CAF50" : "#2196F3",
                    textAlign: "center",
                  }}
                >
                  {getInterviewRate()}%
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* AI Insights */}
          <Paper
            sx={{
              p: 4,
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
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  background: `${primaryColor}20`,
                  color: primaryColor,
                  mr: 2,
                }}
              >
                <Lightbulb />
              </Box>
              <Typography
                variant="h5"
                fontWeight={600}
                sx={{
                  color: isDark ? "#FFFFFF" : "#000000",
                }}
              >
                AI Insights & Recommendations
              </Typography>
            </Box>

            {insightLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress sx={{ color: primaryColor }} />
              </Box>
            ) : error ? (
              <Typography
                sx={{
                  color: "#f44336",
                  textAlign: "center",
                  py: 2,
                }}
              >
                {error}
              </Typography>
            ) : (
              <Typography
                sx={{
                  color: isDark ? "rgba(255,255,255,0.9)" : "rgba(0,0,0,0.8)",
                  lineHeight: 1.8,
                  fontSize: "1.1rem",
                }}
              >
                {insight?.summary ||
                  `Based on your ${totalApplications} applications, you're making great progress in your job search! ${
                    stats.interview > 0
                      ? `Your ${stats.interview} interview${
                          stats.interview > 1 ? "s" : ""
                        } show strong potential. `
                      : "Consider focusing on tailoring your applications to specific roles. "
                  }${
                    stats.accepted > 0
                      ? `Congratulations on your ${stats.accepted} offer${
                          stats.accepted > 1 ? "s" : ""
                        }!`
                      : "Keep refining your approach and you'll see success soon."
                  }`}
              </Typography>
            )}
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}
