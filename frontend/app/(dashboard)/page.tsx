"use client"
import React, { useState } from "react";
import { Box, TextField, Button, Typography, Container, CircularProgress } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import InvestmentSuggestions from "../components/InvestmentSuggestions";
import Stack from '@mui/material/Stack';

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [investmentSuggestions, setInvestmentSuggestions] = useState([])
  const [chatMessages, setChatMessages] = useState([] as any[])
  const [message, setMessage] = useState("");

  const handleButtonClick = async () => {
    setLoading(true);

    let response = await fetch("https://stewardbot.azurewebsites.net/api/v1/assistant/thread",
      {
        method: "GET",
        redirect: "follow"
      }
    )

    let res = await response.json();

    console.log(res.threadId);
    let threadId = res.threadId
    setThreadId(threadId)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    //const message = "give me 10 investment crypto tokens suggestions that I can swap in Arbitrum network"
    let raw;
    if (message.includes("suggestions")) {
      raw = JSON.stringify({
        "threadId": threadId,
        "message": message + " in crypto tokens, in a JSON object called investments, with only 3 properties: tokenName, tokenTicker, and reason "
      });

      const response2 = await fetch("https://stewardbot.azurewebsites.net/api/v1/assistant",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        }
      )

      let res2 = await response2.json();

      console.log(res2);
      let investmentSuggestions = JSON.parse(res2.messages[0][0].text.value).investments
      setInvestmentSuggestions(investmentSuggestions)
      console.log(investmentSuggestions)

      setLoading(false);

      if (investmentSuggestions.length > 0)
        setShowOptions(true)

    } else {
      raw = JSON.stringify({
        "threadId": threadId,
        "message": message
      });

      const response2 = await fetch("https://stewardbot.azurewebsites.net/api/v1/assistant",
        {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        }
      )

      let res2 = await response2.json();

      console.log(res2);
      setLoading(false);
      setChatMessages([...chatMessages,
      { originator: "user", datetime: new Date(), message: message },
      { originator: "agent", datetime: new Date(), message: "Recomendation: " + JSON.parse(res2.messages[0][0].text.value).recommendation + ". Reason: " + JSON.parse(res2.messages[0][0].text.value).reason }
      ]);
    }

    console.log("end of responding -> chatMessages: ", chatMessages)



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
        Welcome to your new favorite DeFAI Agent
      </Typography>

      <Typography variant="h6" sx={{ mb: 2, textAlign: "center" }}>
        Prompts examples:
        <br />
        1. Give me [number] investment suggestions to swap in Arbitrum
        <br />
        2. Should I invest in [token name]?
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
        {/* Subtitle
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          What can I help you with?
        </Typography> */}

        <Stack
          direction="column"
          spacing={2}
        >
          {/* InvestmentOptions appears after loading */}
          <div>
            {
              showOptions && <InvestmentSuggestions investmentData={investmentSuggestions} />
            }
          </div>

          <Stack
            direction="column"
            spacing={2}
          >
            {
              chatMessages.map((element, index) => {
                console.log("element: ", element.originator)
                if (element.originator == "user") {
                  return <Typography variant="h6" key={message + index} sx={{ mb: 2, textAlign: "right" }}>
                    {element.message}
                  </Typography>
                } else {
                  return <Typography variant="h6" key={message + index} sx={{ mb: 2, textAlign: "left" }}>
                    {element.message}
                  </Typography>
                }
              })
            }
          </Stack>

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
              variant="outlined"
              placeholder="Ask me investment suggestions..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{
                borderRadius: "20px",
                backgroundColor: "white",
                width: "500px"
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
        </Stack>

        {/* Input Box with Send Button */}

      </Container>
    </>
  );
}
