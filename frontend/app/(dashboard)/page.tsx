import React from "react";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function HomePage() {
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
          fontSize: "2.5rem", // Adjust font size
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
          height: "100vh", // Center vertically
          textAlign: "center",
          mt: 15,
        }}
      >
        {/* Gradient Heading */}


        {/* Subtitle */}
        <Typography variant="h4" component="h4" sx={{ marginBottom: 2 }}>
          What can I help you with?
        </Typography>

        {/* Input Box with Send Button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            gap: 1,
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type here..."
            rows={4}
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
              borderRadius: "50%", // Circular button
            }}
          >
            <SendIcon />
          </Button>
        </Box>
      </Container>
    </>
  );
}
