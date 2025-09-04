import React, { useState, useEffect, useRef } from "react";
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
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SmartToyIcon from "@mui/icons-material/SmartToy";

export default function CareerChatbot() {
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem("careerChatConversation");
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const scrollRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, conversation }),
      });

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

  return (
    <Box sx={{ bgcolor: "#fff", py: 4, ml: 5 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Career Chatbot
        </Typography>

        <Paper
          sx={{
            p: 3,
            borderRadius: "16px",
            mb: 3,
            maxHeight: 550,
            overflowY: "auto",
            bgcolor: "#fff",
            border: "1px solid #C48CB3",
            width: 1000,
            height: 400,
          }}
          ref={scrollRef}
        >
          <Stack spacing={2}>
            {conversation.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  gap: 1,
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: msg.role === "user" ? "#C48CB3" : "#9F6496",
                    width: 32,
                    height: 32,
                  }}
                >
                  {msg.role === "user" ? (
                    <AccountCircleIcon />
                  ) : (
                    <SmartToyIcon />
                  )}
                </Avatar>
                <Paper
                  sx={{
                    p: 1.5,
                    borderRadius: "12px",
                    bgcolor: msg.role === "user" ? "#C48CB3" : "#9F6496",
                    color: "#fff",
                    maxWidth: "80%",
                  }}
                >
                  <Typography variant="body1">{msg.content}</Typography>
                </Paper>
              </Box>
            ))}
            {loading && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress sx={{ color: "#C48CB3" }} />
              </Box>
            )}
          </Stack>
        </Paper>

        <form onSubmit={handleSend}>
          <TextField
            label="Type your message..."
            multiline
            rows={2}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ mb: 2, width: 1000 }}
          />

          <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                borderRadius: "16px",
                bgcolor: "#C48CB3",
                width: "150px",
                "&:hover": { bgcolor: "#9F6496" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                "Send"
              )}
            </Button>

            <Button
              variant="outlined"
              color="error"
              onClick={handleClearChat}
              sx={{
                borderRadius: "16px",
                width: "150px",
                fontWeight: 600,
                "&:hover": { bgcolor: "#9F6496", color:"#ffffff" },
              }}
            >
              Clear Chat
            </Button>
          </Box>

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </form>
      </Container>
    </Box>
  );
}
