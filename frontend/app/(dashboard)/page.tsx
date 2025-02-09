"use client"
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InvestmentSuggestions from "../components/InvestmentSuggestions";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const handleButtonClick = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowOptions(true);
    }, 1000);
  };

  return (
    <>
      <Typography
        variant="h1"
        component="h2"
        sx={{
          textAlign: "center",
          background: "linear-gradient(90deg, #007BFF, #A020F0)", // Blue to Purple gradient
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: "2.5rem",
          fontWeight: "bold",
          marginBottom: 7,
        }}
      >
        Welcome to your new favorite DeFi Agent
      </Typography>

      <Container
        maxWidth="md"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "left",
          textAlign: "center",
          mt: 5,
        }}
      >
        {/* Subtitle */}
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          What can I help you with?
        </Typography>

        {/* Input Box with Send Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 1,
            marginBottom: 2, // Add spacing for loading & options
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type here..."
            sx={{
              borderRadius: "20px",
              backgroundColor: "white",
            }}
          />
          <Button
            color="primary"
            sx={{
              minWidth: "50px",
              height: "50px",
              borderRadius: "50%",
            }}
            onClick={handleButtonClick}
          >
            <SendIcon />
          </Button>
        </Box>

        {/* Loading Indicator */}
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginTop: 2 }}>
            <CircularProgress size={24} />
            <Typography variant="body1">Thinking...🧠</Typography>
          </Box>
        )}

        {/* InvestmentOptions appears after loading */}
        {showOptions && !loading && <InvestmentSuggestions />}
      </Container>
    </>
  );
}
