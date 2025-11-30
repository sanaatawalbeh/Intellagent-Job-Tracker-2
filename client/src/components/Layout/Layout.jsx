// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout() {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        bgcolor: isDark ? "#020617" : "#f9fafb", // الخلفية حسب الثيم
        color: isDark ? "#e5e7eb" : "#0f172a", // لون النص حسب الثيم
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
        }}
      >
        <Outlet />
      </Box>

      <Footer />
    </Box>
  );
}

export default Layout;
