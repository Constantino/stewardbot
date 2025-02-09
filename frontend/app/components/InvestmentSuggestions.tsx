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

export default function InvestmentSuggestions() {
  const theme = useTheme();
  const [investmentData] = React.useState(generateRandomData()); // Data is now static
  const [selected, setSelected] = React.useState({});

  // Handle Checkbox Change
  const handleCheckboxChange = (coinName) => {
    setSelected((prev) => ({ ...prev, [coinName]: !prev[coinName] }));
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Based on my investigation, here are some asset investment suggestions.
      </Typography>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add the ones that you want to your portfolio.
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Price ($)</TableCell>
                  <TableCell align="right">% 24H</TableCell>
                  <TableCell align="right">% 7D</TableCell>
                  <TableCell align="right">% 30D</TableCell>
                  <TableCell align="center">Last 24 hrs</TableCell>
                  <TableCell align="center">Select</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {investmentData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.coinName}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    <TableCell align="right" sx={{ color: row.change24h >= 0 ? "green" : "red" }}>
                      {row.change24h}%
                    </TableCell>
                    <TableCell align="right" sx={{ color: row.change7d >= 0 ? "green" : "red" }}>
                      {row.change7d}%
                    </TableCell>
                    <TableCell align="right" sx={{ color: row.change30d >= 0 ? "green" : "red" }}>
                      {row.change30d}%
                    </TableCell>
                    <TableCell align="center">
                      <SparkLineChart
                        data={row.chartData}
                        width={100}
                        height={30}
                        colors={[row.isGreen ? "green" : "red"]}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Checkbox
                        checked={!!selected[row.coinName]}
                        onChange={() => handleCheckboxChange(row.coinName)}
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
            <Button variant="contained" color="primary">
              Invest
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
