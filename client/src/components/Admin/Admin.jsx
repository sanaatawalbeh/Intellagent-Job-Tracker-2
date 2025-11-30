import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
  Select,
  MenuItem,
  Typography,
  Stack,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Delete, Business, Work, Email, Analytics } from "@mui/icons-material";

export default function AdminDashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setError(null);
        const appsSnapshot = await getDocs(collection(db, "applications"));
        const appsData = appsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersMap = {};
        usersSnapshot.docs.forEach((doc) => {
          usersMap[doc.id] = doc.data().email;
        });

        const appsWithEmail = appsData.map((app) => ({
          ...app,
          email: usersMap[app.uid] || "No email",
        }));

        setApplications(appsWithEmail);
      } catch (error) {
        console.error("🔥 Error loading applications:", error);
        setError("Failed to load applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const docRef = doc(db, "applications", id);
      await updateDoc(docRef, { status: newStatus });
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
    } catch (error) {
      console.error(error);
      setError("Failed to update application status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const docRef = doc(db, "applications", id);
      await deleteDoc(docRef);
      setApplications((prev) => prev.filter((app) => app.id !== id));
    } catch (error) {
      console.error(error);
      setError("Failed to delete application");
    }
  };

  const stats = {
    total: applications.length,
    applied: applications.filter((app) => app.status === "applied").length,
    interview: applications.filter((app) => app.status === "interview").length,
    accepted: applications.filter((app) => app.status === "accepted").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
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

  return (
    <Box sx={{ p: 3 }}>
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
          Admin Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Manage all user applications and track progress
        </Typography>
      </Box>

      {/* Stats Cards (بدون Grid) */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { key: "total", label: "Total Applications", icon: <Work /> },
          { key: "applied", label: "Applied", icon: <Business /> },
          { key: "interview", label: "Interview", icon: <Email /> },
          { key: "accepted", label: "Accepted", icon: <Analytics /> },
          { key: "rejected", label: "Rejected", icon: <Delete /> },
        ].map((stat) => (
          <Card
            key={stat.key}
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
                    background: `${primaryColor}20`,
                    color: primaryColor,
                  }}
                >
                  {stat.icon}
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
                {stats[stat.key]}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                  fontWeight: 600,
                }}
              >
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
          {error}
        </Alert>
      )}

      {/* Applications Table */}
      <Paper
        sx={{
          borderRadius: "16px",
          background: isDark
            ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
            : "linear-gradient(135deg, #FFFFFF 0%, #FDFCFD 100%)",
          border: isDark
            ? "1px solid rgba(255,255,255,0.1)"
            : "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            p: 3,
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Typography
            variant="h6"
            fontWeight={600}
            sx={{
              color: isDark ? "#FFFFFF" : "#000000",
            }}
          >
            All Applications
          </Typography>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: isDark
                    ? "rgba(196,140,179,0.2)"
                    : "rgba(196,140,179,0.1)",
                }}
              >
                <TableCell
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontWeight: 600,
                  }}
                >
                  Company
                </TableCell>
                <TableCell
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontWeight: 600,
                  }}
                >
                  Position
                </TableCell>
                <TableCell
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontWeight: 600,
                  }}
                >
                  Status
                </TableCell>
                <TableCell
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontWeight: 600,
                  }}
                >
                  User Email
                </TableCell>
                <TableCell
                  sx={{
                    color: isDark ? "#FFFFFF" : "#000000",
                    fontWeight: 600,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {applications.map((app) => (
                <TableRow
                  key={app.id}
                  sx={{
                    background: isDark
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)",
                    "&:hover": {
                      background: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <TableCell sx={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business sx={{ color: primaryColor, fontSize: 20 }} />
                      {app.company}
                    </Box>
                  </TableCell>
                  <TableCell sx={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                    {app.position}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={app.status}
                      onChange={(e) =>
                        handleStatusChange(app.id, e.target.value)
                      }
                      size="small"
                      sx={{
                        minWidth: 120,
                        color: isDark ? "#FFFFFF" : "#000000",
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: isDark
                            ? "rgba(255,255,255,0.3)"
                            : "rgba(0,0,0,0.3)",
                        },
                        "& .MuiSelect-icon": {
                          color: isDark ? "#FFFFFF" : "#000000",
                        },
                      }}
                    >
                      <MenuItem value="applied">Applied</MenuItem>
                      <MenuItem value="interview">Interview</MenuItem>
                      <MenuItem value="accepted">Accepted</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell sx={{ color: isDark ? "#FFFFFF" : "#000000" }}>
                    {app.email}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Delete />}
                        onClick={() => handleDelete(app.id)}
                        sx={{
                          borderColor: "#f44336",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#d32f2f",
                            background: "rgba(244,67,54,0.04)",
                          },
                        }}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {applications.length === 0 && !loading && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography
              variant="body1"
              sx={{
                color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
              }}
            >
              No applications found
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
