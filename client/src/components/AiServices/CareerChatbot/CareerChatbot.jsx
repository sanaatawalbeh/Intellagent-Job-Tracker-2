import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Stack,
  IconButton,
  Fade,
  Alert,
} from "@mui/material";
import {
  AccountCircle,
  SmartToy,
  Send,
  Delete,
  Psychology,
} from "@mui/icons-material";

export default function CareerChatbot() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem("careerChatConversation");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  const primaryColor = "#C48CB3";
  const secondaryColor = isDark ? "#E8B4D9" : "#A86B97";

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        "https://intellagent-job-tracker-2.onrender.com/api/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message, conversation }),
        }
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data?.error || `Request failed with status ${res.status}`
        );
      }

      const data = await res.json();
      const aiMessage = data.message;

      setConversation((prev) => [
        ...prev,
        { role: "user", content: message },
        { role: "assistant", content: aiMessage },
      ]);

      setMessage("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // حفظ المحادثة
  useEffect(() => {
    localStorage.setItem(
      "careerChatConversation",
      JSON.stringify(conversation)
    );
  }, [conversation]);

  // Scroll تلقائي
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [conversation]);

  // مسح المحادثة
  const handleClearChat = () => {
    setConversation([]);
    localStorage.removeItem("careerChatConversation");
  };

  const suggestedQuestions = [
    "How can I improve my resume?",
    "What are the best job search strategies?",
    "How to prepare for a technical interview?",
    "What skills are in demand for software developers?",
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Psychology
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
          Career Assistant
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)",
          }}
        >
          Get AI-powered career advice and guidance
        </Typography>
      </Box>

      <Fade in={true} timeout={800}>
        <Box>
          {/* Chat Container */}
          <Paper
            sx={{
              borderRadius: "20px",
              background: isDark
                ? "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)"
                : "linear-gradient(135deg, #FFFFFF 0%, #FDFCFD 100%)",
              border: isDark
                ? "1px solid rgba(255,255,255,0.1)"
                : "1px solid rgba(0,0,0,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
              overflow: "hidden",
              mb: 3,
            }}
          >
            {/* Chat Messages */}
            <Box
              ref={scrollRef}
              sx={{
                height: 400,
                overflowY: "auto",
                p: 3,
                background: isDark
                  ? "rgba(0,0,0,0.2)"
                  : "linear-gradient(180deg, #F8F4FF 0%, #FFFFFF 100%)",
              }}
            >
              <Stack spacing={2}>
                {conversation.length === 0 && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <SmartToy
                      sx={{
                        fontSize: 64,
                        color: primaryColor,
                        mb: 2,
                        opacity: 0.7,
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        color: isDark
                          ? "rgba(255,255,255,0.7)"
                          : "rgba(0,0,0,0.6)",
                        mb: 2,
                      }}
                    >
                      Hello! I'm your career assistant. How can I help you
                      today?
                    </Typography>

                    {/* Suggested Questions */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      {suggestedQuestions.map((question, index) => (
                        <Paper
                          key={index}
                          onClick={() => setMessage(question)}
                          sx={{
                            p: 1.5,
                            borderRadius: "12px",
                            background: isDark
                              ? "rgba(196,140,179,0.1)"
                              : "rgba(196,140,179,0.05)",
                            border: `1px solid ${primaryColor}30`,
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              background: isDark
                                ? "rgba(196,140,179,0.2)"
                                : "rgba(196,140,179,0.1)",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: isDark ? "#E8B4D9" : "#A86B97",
                              fontWeight: 500,
                            }}
                          >
                            {question}
                          </Typography>
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                )}

                {conversation.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexDirection:
                        msg.role === "user" ? "row-reverse" : "row",
                      alignItems: "flex-start",
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor:
                          msg.role === "user" ? primaryColor : secondaryColor,
                        width: 40,
                        height: 40,
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      {msg.role === "user" ? <AccountCircle /> : <SmartToy />}
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        background:
                          msg.role === "user"
                            ? isDark
                              ? "linear-gradient(135deg, #C48CB3 0%, #E8B4D9 100%)"
                              : "linear-gradient(135deg, #C48CB3 0%, #A86B97 100%)"
                            : isDark
                            ? "rgba(255,255,255,0.05)"
                            : "rgba(255,255,255,0.8)",
                        border:
                          msg.role === "user"
                            ? "none"
                            : isDark
                            ? "1px solid rgba(255,255,255,0.1)"
                            : "1px solid rgba(0,0,0,0.08)",
                        color:
                          msg.role === "user"
                            ? "#FFFFFF"
                            : isDark
                            ? "#FFFFFF"
                            : "#000000",
                        maxWidth: "70%",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                        {msg.content}
                      </Typography>
                    </Paper>
                  </Box>
                ))}

                {loading && (
                  <Box
                    sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: secondaryColor,
                        width: 40,
                        height: 40,
                      }}
                    >
                      <SmartToy />
                    </Avatar>
                    <Paper
                      sx={{
                        p: 2,
                        borderRadius: "16px",
                        background: isDark
                          ? "rgba(255,255,255,0.05)"
                          : "rgba(255,255,255,0.8)",
                        border: isDark
                          ? "1px solid rgba(255,255,255,0.1)"
                          : "1px solid rgba(0,0,0,0.08)",
                      }}
                    >
                      <CircularProgress
                        size={20}
                        sx={{ color: primaryColor }}
                      />
                    </Paper>
                  </Box>
                )}
              </Stack>
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 3,
                borderTop: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              <Box
                component="form"
                onSubmit={handleSend}
                sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}
              >
                <TextField
                  label="Type your message..."
                  multiline
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  fullWidth
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                      background: isDark
                        ? "rgba(255,255,255,0.05)"
                        : "rgba(255,255,255,0.8)",
                      "&:hover fieldset": {
                        borderColor: primaryColor,
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: primaryColor,
                        borderWidth: "2px",
                      },
                    },
                    "& .MuiInputLabel-root": {
                      color: isDark
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(0,0,0,0.6)",
                    },
                  }}
                />

                <IconButton
                  type="submit"
                  disabled={loading || !message.trim()}
                  sx={{
                    bgcolor: primaryColor,
                    color: "#FFFFFF",
                    width: 48,
                    height: 48,
                    "&:hover": {
                      bgcolor: secondaryColor,
                      transform: "scale(1.05)",
                    },
                    "&:disabled": {
                      bgcolor: isDark
                        ? "rgba(255,255,255,0.1)"
                        : "rgba(0,0,0,0.1)",
                    },
                    transition: "all 0.3s ease",
                  }}
                >
                  <Send />
                </IconButton>

                {conversation.length > 0 && (
                  <IconButton
                    onClick={handleClearChat}
                    sx={{
                      bgcolor: isDark
                        ? "rgba(244,67,54,0.1)"
                        : "rgba(244,67,54,0.05)",
                      color: "#f44336",
                      width: 48,
                      height: 48,
                      "&:hover": {
                        bgcolor: "#f44336",
                        color: "#FFFFFF",
                      },
                      transition: "all 0.3s ease",
                    }}
                  >
                    <Delete />
                  </IconButton>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2, borderRadius: "12px" }}>
                  {error}
                </Alert>
              )}
            </Box>
          </Paper>
        </Box>
      </Fade>
    </Container>
  );
}
