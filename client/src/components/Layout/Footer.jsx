// src/components/Footer.jsx
import { useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import { FiGithub, FiLinkedin, FiMail } from "react-icons/fi";

function Footer() {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const socialLinks = [
    {
      icon: <FiGithub />,
      href: "https://github.com/sanaatawalbeh",
      label: "GitHub",
    },
    {
      icon: <FiLinkedin />,
      // عدّلي اللينك هان للـ LinkedIn تبعك
      href: "https://www.linkedin.com/in/your-linkedin-username",
      label: "LinkedIn",
    },
    {
      icon: <FiMail />,
      // عدّلي الإيميل لو بدك
      href: "mailto:hello@careerhive.com",
      label: "Email",
    },
  ];

  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        borderTop: "1px solid",
        borderColor: isDark
          ? "rgba(148,163,184,0.35)"
          : "rgba(148,163,184,0.4)",
        backgroundColor: isDark ? "#020617" : "#f9fafb",
        color: isDark ? "#e5e7eb" : "#111827",
        py: 2,
        px: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
        }}
      >
        {/* النص */}
        <Typography
          variant="body2"
          sx={{
            fontSize: "0.85rem",
            textAlign: { xs: "center", sm: "left" },
          }}
        >
          &copy; {new Date().getFullYear()} CareerHive. All rights reserved.
        </Typography>

        {/* السوشال لينكس */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: { xs: "center", sm: "flex-end" },
          }}
        >
          {socialLinks.map((social) => (
            <IconButton
              key={social.label}
              component={Link}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              sx={{
                color: isDark ? "#9CA3AF" : "#6B7280",
                "&:hover": {
                  color: isDark ? "#ffffff" : "#111827",
                },
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
