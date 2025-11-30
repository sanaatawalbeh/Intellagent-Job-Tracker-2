// src/components/Navbar.jsx
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../../redux/themeSlice";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

function Navbar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      setScrolled(isScrolled);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pages = [
    { label: "Home", to: "/" },
    { label: "Register", to: "/register" },
    { label: "Login", to: "/login" },
  ];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        px: 2,
        backdropFilter: scrolled ? "blur(20px)" : "blur(16px)",
        borderBottom: "1px solid",
        borderColor: isDark
          ? scrolled
            ? "rgba(255,255,255,0.1)"
            : "rgba(255,255,255,0.05)"
          : scrolled
          ? "rgba(168,85,247,0.2)"
          : "rgba(148,163,184,0.1)",
        background: isDark
          ? scrolled
            ? "rgba(0,0,0,0.95)"
            : "rgba(0,0,0,0.98)"
          : scrolled
          ? "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(192,132,252,0.08) 100%)"
          : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(192,132,252,0.05) 100%)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        transform: scrolled ? "translateY(0)" : "translateY(0)",
        boxShadow: scrolled
          ? isDark
            ? "0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(255,255,255,0.05)"
            : "0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(168,85,247,0.05)"
          : "none",
      }}
    >
      <Toolbar
        disableGutters
        sx={{
          maxWidth: 1200,
          mx: "auto",
          width: "100%",
          py: scrolled ? 0.5 : 1,
          transition: "all 0.3s ease",
        }}
      >
        {/* Logo + Title */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1.5,
            flexGrow: { xs: 1, md: 0 },
            transition: "all 0.3s ease",
          }}
        >
          <Box
            sx={{
              width: scrolled ? 36 : 40,
              height: scrolled ? 36 : 40,
              borderRadius: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: isDark
                ? "linear-gradient(135deg, #404040 0%, #262626 50%, #000000 100%)"
                : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)",
              color: isDark ? "#FFFFFF" : "#FFFFFF",
              boxShadow: isDark
                ? "0 8px 25px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)"
                : "0 8px 25px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.3)",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              "&:hover": {
                transform: "scale(1.05) rotate(5deg)",
                boxShadow: isDark
                  ? "0 12px 35px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.1)"
                  : "0 12px 35px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.3)",
              },
            }}
          >
            <WorkOutlineIcon
              fontSize="small"
              sx={{
                fontSize: scrolled ? "1.1rem" : "1.25rem",
                transition: "font-size 0.3s ease",
              }}
            />
          </Box>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 800,
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: isDark ? "#FFFFFF" : "#7C3AED",
              fontSize: scrolled ? "1.1rem" : "1.25rem",
              transition: "all 0.3s ease",
              textShadow: isDark ? "0 2px 4px rgba(0,0,0,0.5)" : "none",
            }}
          >
            CareerHive
          </Typography>
        </Box>

        {/* Mobile Menu */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "flex", md: "none" },
            justifyContent: "flex-end",
          }}
        >
          <IconButton
            size="large"
            aria-label="open navigation menu"
            onClick={handleOpenNavMenu}
            sx={{
              color: isDark ? "#FFFFFF" : "#7C3AED",
              background: isDark
                ? "rgba(255,255,255,0.1)"
                : "rgba(168,85,247,0.08)",
              border: "1px solid",
              borderColor: isDark
                ? "rgba(255,255,255,0.2)"
                : "rgba(168,85,247,0.2)",
              "&:hover": {
                background: isDark
                  ? "rgba(255,255,255,0.15)"
                  : "rgba(168,85,247,0.15)",
                transform: "scale(1.05)",
              },
              transition: "all 0.3s ease",
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            keepMounted
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPaper-root": {
                background: isDark
                  ? "rgba(0,0,0,0.95)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(192,132,252,0.1) 100%)",
                backdropFilter: "blur(20px)",
                border: "1px solid",
                borderColor: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(168,85,247,0.1)",
                borderRadius: "16px",
                boxShadow: isDark
                  ? "0 20px 40px rgba(0,0,0,0.5), 0 8px 16px rgba(255,255,255,0.05)"
                  : "0 20px 40px rgba(0,0,0,0.1), 0 8px 16px rgba(168,85,247,0.05)",
                mt: 1,
              },
            }}
          >
            {pages.map((page) => (
              <MenuItem
                key={page.to}
                onClick={handleCloseNavMenu}
                sx={{
                  "&:hover": {
                    background: isDark
                      ? "rgba(255,255,255,0.1)"
                      : "rgba(168,85,247,0.08)",
                  },
                }}
              >
                <NavLink
                  to={page.to}
                  style={({ isActive }) => ({
                    textDecoration: "none",
                    width: "100%",
                    padding: "8px 16px",
                    borderRadius: "12px",
                    background: isActive
                      ? isDark
                        ? "rgba(255,255,255,0.15)"
                        : "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(139,92,246,0.08) 100%)"
                      : "transparent",
                    color: isActive
                      ? isDark
                        ? "#FFFFFF"
                        : "#7C3AED"
                      : isDark
                      ? "#E5E7EB"
                      : "#64748B",
                    fontWeight: isActive ? 700 : 500,
                    border: isActive ? "1px solid" : "none",
                    borderColor: isActive
                      ? isDark
                        ? "rgba(255,255,255,0.3)"
                        : "rgba(168,85,247,0.3)"
                      : "transparent",
                  })}
                >
                  {page.label}
                </NavLink>
              </MenuItem>
            ))}
          </Menu>
        </Box>

        {/* Desktop Links */}
        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 1.5,
          }}
        >
          {pages.map((page) => (
            <NavLink
              key={page.to}
              to={page.to}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Button
                  size="small"
                  sx={{
                    borderRadius: "14px",
                    textTransform: "none",
                    fontWeight: isActive ? 700 : 600,
                    fontSize: "0.9rem",
                    px: 3,
                    py: 1,
                    color: isActive
                      ? isDark
                        ? "#000000"
                        : "#FFFFFF"
                      : isDark
                      ? "#E5E7EB"
                      : "#64748B",
                    background: isActive
                      ? isDark
                        ? "rgba(255,255,255,0.9)"
                        : "linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A855F7 100%)"
                      : isDark
                      ? "rgba(255,255,255,0.05)"
                      : "rgba(168,85,247,0.03)",
                    border: isActive ? "none" : "1.5px solid",
                    borderColor: isDark
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(168,85,247,0.15)",
                    boxShadow: isActive
                      ? isDark
                        ? "0 8px 25px rgba(255,255,255,0.2), inset 0 1px 0 rgba(255,255,255,0.3)"
                        : "0 8px 25px rgba(168,85,247,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
                      : "none",
                    "&:hover": {
                      background: isActive
                        ? isDark
                          ? "rgba(255,255,255,1)"
                          : "linear-gradient(135deg, #6D28D9 0%, #7C3AED 50%, #8B5CF6 100%)"
                        : isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(168,85,247,0.08)",
                      transform: "translateY(-2px)",
                      boxShadow: isActive
                        ? isDark
                          ? "0 12px 35px rgba(255,255,255,0.3), inset 0 1px 0 rgba(255,255,255,0.3)"
                          : "0 12px 35px rgba(168,85,247,0.4), inset 0 1px 0 rgba(255,255,255,0.3)"
                        : isDark
                        ? "0 8px 25px rgba(0,0,0,0.3), 0 4px 12px rgba(255,255,255,0.1)"
                        : "0 8px 25px rgba(0,0,0,0.1), 0 4px 12px rgba(168,85,247,0.05)",
                    },
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  }}
                >
                  {page.label}
                </Button>
              )}
            </NavLink>
          ))}
        </Box>

        {/* Theme Toggle */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, ml: 2 }}>
          <Tooltip
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <IconButton
              onClick={() => dispatch(toggleTheme())}
              sx={{
                borderRadius: "14px",
                border: "1.5px solid",
                borderColor: isDark
                  ? "rgba(255,255,255,0.2)"
                  : "rgba(168,85,247,0.2)",
                background: isDark
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(168,85,247,0.05)",
                color: isDark ? "#FFFFFF" : "#7C3AED",
                "&:hover": {
                  background: isDark
                    ? "rgba(255,255,255,0.15)"
                    : "rgba(168,85,247,0.1)",
                  transform: "scale(1.1) rotate(15deg)",
                  borderColor: isDark
                    ? "rgba(255,255,255,0.3)"
                    : "rgba(168,85,247,0.3)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              {isDark ? (
                <Brightness7Icon fontSize="small" />
              ) : (
                <Brightness4Icon fontSize="small" />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
