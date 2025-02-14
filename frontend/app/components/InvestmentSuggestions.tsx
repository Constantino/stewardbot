import * as React from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Checkbox,
  Button,
} from "@mui/material";
import { SparkLineChart } from "@mui/x-charts/SparkLineChart";

// Sample Data (Only asset names)
const dummyData = [
  { coinName: "Bitcoin" },
  { coinName: "Ethereum" },
  { coinName: "Solana" },
  { coinName: "Cardano" },
  { coinName: "Polkadot" },
  { coinName: "Chainlink" },
  { coinName: "Dogecoin" },
  { coinName: "Avalanche" },
  { coinName: "Litecoin" },
  { coinName: "MATIC" },
];

// Helper Function: Generate Random Data (Only runs once)
const generateRandomData = () =>
  dummyData.map((asset) => ({
    ...asset,
    price: (Math.random() * 5000 + 10).toFixed(2), // Random price between 10 - 5000
    change24h: (Math.random() * 10 - 5).toFixed(2), // Random % change (-5% to 5%)
    change7d: (Math.random() * 20 - 10).toFixed(2), // Random % change (-10% to 10%)
    change30d: (Math.random() * 40 - 20).toFixed(2), // Random % change (-20% to 20%)
    chartData: Array.from({ length: 10 }, () => Math.random() * 100), // 10 Random Points
    isGreen: Math.random() > 0.5, // Randomly decide if it's green or red
  }));

export default function InvestmentSuggestions({ investmentData }) {

  console.log("investmentData: ", investmentData)
  const theme = useTheme();
  // const [investmentData] = React.useState(generateRandomData()); // Data is now static
  const [selected, setSelected] = React.useState({});

  // Handle Checkbox Change
  const handleCheckboxChange = (coinName) => {
    console.log("selected: ", selected);
    setSelected((prev) => ({ ...prev, [coinName]: !prev[coinName] }));
  }; 

  const handleInvest = async () => {
    let tokensObj = []
    const tokens = Object.keys(selected).map((key) => tokensObj.push({ [key]: selected[key] }));

    console.log("tokens sent: ", tokensObj)

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let raw = JSON.stringify({
      "tokens": tokensObj,
      "network": "arbitrum"
    });
    const response2 = await fetch("https://stewardbot.azurewebsites.net/api/v1/invest", 
      {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      }
    )

    let res2 = await response2.json();

    console.log(res2); 
  }


  return (
    <Box sx={{ mt: 0 }}>
      <Typography variant="h7" sx={{ mb: 2 }}>
        Based on my investigation, here are some asset investment suggestions. Add the ones that you want to your portfolio.
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Token</TableCell>
                  <TableCell>Ticker</TableCell>
                  <TableCell>Potential</TableCell>
                  <TableCell align="center">Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investmentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.tokenName}</TableCell>
                    <TableCell align="right">{row.tokenTicker}</TableCell>
                    <TableCell align="right">{row.reason}</TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={!!selected[row.tokenTicker]}
                        onChange={() => handleCheckboxChange(row.tokenTicker)}
                        color="primary"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {/* Invest Button */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button variant="contained" color="primary" onClick={ () => handleInvest() }>
              Invest
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
