import * as React from 'react';
import { useTheme } from '@mui/material/styles';
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
} from '@mui/material';

const dummyData = [
  { coinName: 'Bitcoin', amount: 1.5, coinCost: 45000, coinPrice: 47000, profitLoss: 3000, change24h: 2.5, walletPercentage: 50 },
  { coinName: 'Ethereum', amount: 10, coinCost: 3000, coinPrice: 3200, profitLoss: 2000, change24h: 3.0, walletPercentage: 30 },
  { coinName: 'Solana', amount: 50, coinCost: 150, coinPrice: 170, profitLoss: 1000, change24h: 5.5, walletPercentage: 10 },
  { coinName: 'Cardano', amount: 200, coinCost: 1.1, coinPrice: 0.9, profitLoss: -40, change24h: -2.0, walletPercentage: 5 },
  { coinName: 'Polkadot', amount: 100, coinCost: 7, coinPrice: 9, profitLoss: 200, change24h: 1.2, walletPercentage: 3 },
  { coinName: 'Chainlink', amount: 30, coinCost: 20, coinPrice: 25, profitLoss: 150, change24h: 4.3, walletPercentage: 2 },
  { coinName: 'Dogecoin', amount: 5000, coinCost: 0.05, coinPrice: 0.07, profitLoss: 100, change24h: 6.1, walletPercentage: 1 },
  { coinName: 'Avalanche', amount: 15, coinCost: 50, coinPrice: 55, profitLoss: 75, change24h: 3.8, walletPercentage: 1 },
  { coinName: 'Litecoin', amount: 5, coinCost: 200, coinPrice: 180, profitLoss: -100, change24h: -1.5, walletPercentage: 2 },
  { coinName: 'MATIC', amount: 100, coinCost: 0.9, coinPrice: 1.2, profitLoss: 30, change24h: 2.8, walletPercentage: 3 },
];

export default function PositionsTable() {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Positions
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Coin Name</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Coin Cost ($)</TableCell>
                  <TableCell align="right">Coin Price ($)</TableCell>
                  <TableCell align="right">Profit/Loss ($)</TableCell>
                  <TableCell align="right">% 24h Change</TableCell>
                  <TableCell align="right">% Wallet</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dummyData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.coinName}</TableCell>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{row.coinCost.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.coinPrice.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: row.profitLoss >= 0 ? 'green' : 'red' }}>
                      {row.profitLoss.toLocaleString()}
                    </TableCell>
                    <TableCell align="right" sx={{ color: row.change24h >= 0 ? 'green' : 'red' }}>
                      {row.change24h}%
                    </TableCell>
                    <TableCell align="right">{row.walletPercentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}
