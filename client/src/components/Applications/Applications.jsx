import { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import {
  collection,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  Container,
  Grid,
  Paper,
  Typography,
  Stack,
  Button,
  Select,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setApplications } from "../../redux/applicationsSlice";
import {
  Delete,
  FilterList,
  Analytics,
  Business,
  Work,
  CheckCircle,
  Cancel,
  Schedule,
} from "@mui/icons-material";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications.list);
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
        const apps = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        dispatch(setApplications(apps));
        setLoading(false);
      });
    });

    return () => {
      unsubscribeAuth();
      unsubscribeSnapshot();
    };
  }, [dispatch]);

  const handleStatusChange = async (id, newStatus) => {
    const docRef = doc(db, "applications", id);
    await updateDoc(docRef, { status: newStatus });
  };

  const handleDelete = async (id) => {
    const docRef = doc(db, "applications", id);
    await deleteDoc(docRef);
  };

  const filteredApplications =
    filter === "all"
      ? applications
      : applications.filter((app) => app.status === filter);

  const stats = {
    applied: applications.filter((a) => a.status === "applied").length,
    interview: applications.filter((a) => a.status === "interview").length,
    accepted: applications.filter((a) => a.status === "accepted").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  };

  const statIcons = {
    applied: <Work sx={{ fontSize: 24 }} />,
    interview: <Schedule sx={{ fontSize: 24 }} />,
    accepted: <CheckCircle sx={{ fontSize: 24 }} />,
    rejected: <Cancel sx={{ fontSize: 24 }} />,
  };

  const statusColors = {
    applied: isDark ? "#83A6CE" : "#83A6CE",
    interview: isDark ? "#E5C9D7" : "#E5C9D7",
    accepted: isDark ? "#4CAF50" : "#4CAF50",
    rejected: isDark ? "#f44336" : "#f44336",
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return <Typography>Please log in</Typography>;

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
          Applications Dashboard
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Track and manage your job applications
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {Object.entries(stats).map(([key, value]) => (
          <Grid item xs={6} sm={3} key={key}>
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
                textAlign: "center",
              }}
            >
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
                    background: `${statusColors[key]}20`,
                    color: statusColors[key],
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
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                  fontWeight: 600,
                  textTransform: "capitalize",
                }}
              >
                {key}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

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
        {/* Table Header */}
        <Box
          sx={{
            p: 3,
            borderBottom: isDark
              ? "1px solid rgba(255,255,255,0.1)"
              : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{
                color: isDark ? "#FFFFFF" : "#000000",
                fontWeight: 700,
              }}
            >
              Application Details
            </Typography>
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel
                sx={{
                  color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
                }}
              >
                Status Filter
              </InputLabel>
              <Select
                value={filter}
                label="Status Filter"
                onChange={(e) => setFilter(e.target.value)}
                sx={{
                  color: isDark ? "#FFFFFF" : "#000000",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: isDark
                      ? "rgba(255,255,255,0.3)"
                      : "rgba(0,0,0,0.3)",
                  },
                }}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="applied">Applied</MenuItem>
                <MenuItem value="interview">Interview</MenuItem>
                <MenuItem value="accepted">Accepted</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>

        {/* Table */}
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
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredApplications.map((app, index) => (
                <TableRow
                  key={app.id}
                  sx={{
                    background:
                      index % 2 === 0
                        ? isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)"
                        : "transparent",
                    "&:hover": {
                      background: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(0,0,0,0.04)",
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      color: isDark ? "#FFFFFF" : "#000000",
                      fontWeight: 500,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Business
                        sx={{
                          color: primaryColor,
                          fontSize: 20,
                        }}
                      />
                      {app.company}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: isDark ? "#FFFFFF" : "#000000",
                    }}
                  >
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
                      }}
                    >
                      <MenuItem value="applied">Applied</MenuItem>
                      <MenuItem value="interview">Interview</MenuItem>
                      <MenuItem value="accepted">Accepted</MenuItem>
                      <MenuItem value="rejected">Rejected</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(app.id)}
                      sx={{
                        borderColor: isDark ? "#f44336" : "#f44336",
                        color: isDark ? "#f44336" : "#f44336",
                        "&:hover": {
                          borderColor: isDark ? "#d32f2f" : "#d32f2f",
                          background: isDark
                            ? "rgba(244,67,54,0.1)"
                            : "rgba(244,67,54,0.04)",
                        },
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
