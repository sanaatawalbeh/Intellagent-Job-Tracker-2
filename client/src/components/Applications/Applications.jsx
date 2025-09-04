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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setApplications } from "../../redux/applicationsSlice";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const dispatch = useDispatch();
  const applications = useSelector((state) => state.applications.list);

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

  if (loading) return <Typography>Loading...</Typography>;
  if (!user) return <Typography>Please log in</Typography>;

  const cardColors = {
    applied: "#83A6CE",
    interview: "#E5C9D7",
    accepted: "#a6f5aaff",
    rejected: "#C48CB3",
  };
  return (
    <Container maxWidth="lg" sx={{ mt: 4, ml: 29 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 700, color: "#C48CB3", textAlign: "center" }}
      >
        Application Summary (AI)
      </Typography>

      <Grid container spacing={2} justifyContent="center" mb={4}>
        {Object.entries(stats).map(([key, value]) => (
          <Grid item xs={6} sm={3} key={key}>
            <Paper
              sx={{
                p: 2,
                borderRadius: "16px",
                bgcolor: cardColors[key], // هنا لون الخلفية
                textAlign: "center",
                color: "#fff",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: 700, color: "#C48CB3", textAlign: "center" }}
      ></Typography>

      {/* جدول */}
      <TableContainer
        component={Paper}
        sx={{
          p: 2,
          mx: "auto",
          maxWidth: "90%",
          borderRadius: "15px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          background: "linear-gradient(145deg, #fff, #fdf4fa)",
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" sx={{ color: "#C48CB3", fontWeight: 700 }}>
            Application Details
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Status Filter</InputLabel>
            <Select
              value={filter}
              label="Status Filter"
              onChange={(e) => setFilter(e.target.value)}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="applied">Applied</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#C48CB3" }}>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Company
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Position
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#fff", fontWeight: 600 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredApplications.map((app, index) => (
              <TableRow
                key={app.id}
                sx={{
                  bgcolor: index % 2 === 0 ? "#FFFFFF" : "#F9F5FB", // ألوان الصفوف
                  "&:hover": { bgcolor: "#F3E8F4" }, // تأثير عند المرور بالماوس
                }}
              >
                <TableCell>{app.company}</TableCell>
                <TableCell>{app.position}</TableCell>
                <TableCell>
                  <Select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    size="small"
                  >
                    <MenuItem value="applied">Applied</MenuItem>
                    <MenuItem value="interview">Interview</MenuItem>
                    <MenuItem value="accepted">Accepted</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      bgcolor: "#C48CB3",
                      color: "#fff",
                      "&:hover": { bgcolor: "#9F6496" },
                    }}
                    onClick={() => handleDelete(app.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}
