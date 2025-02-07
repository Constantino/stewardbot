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

const yieldData = [
  { protocol: 'AAVE', asset: 'USDC', deposited: 5000, apy: 4.2, earnings: 210, rewardToken: 'AAVE', portfolioPercentage: 30 },
  { protocol: 'Compound', asset: 'DAI', deposited: 3000, apy: 3.5, earnings: 105, rewardToken: 'COMP', portfolioPercentage: 20 },
  { protocol: 'Lido', asset: 'stETH', deposited: 2.5, apy: 5.1, earnings: 250, rewardToken: 'stETH', portfolioPercentage: 25 },
  { protocol: 'Curve', asset: 'crvUSD', deposited: 2000, apy: 6.8, earnings: 136, rewardToken: 'CRV', portfolioPercentage: 15 },
  { protocol: 'Yearn', asset: 'yUSDT', deposited: 1500, apy: 7.2, earnings: 108, rewardToken: 'YFI', portfolioPercentage: 10 },
  { protocol: 'Balancer', asset: 'WBTC-ETH', deposited: 1, apy: 8.5, earnings: 200, rewardToken: 'BAL', portfolioPercentage: 5 },
  { protocol: 'Convex', asset: 'cvxCRV', deposited: 500, apy: 10.3, earnings: 51, rewardToken: 'CVX', portfolioPercentage: 5 },
  { protocol: 'Stargate', asset: 'USDT', deposited: 1000, apy: 4.5, earnings: 45, rewardToken: 'STG', portfolioPercentage: 5 },
  { protocol: 'Rocket Pool', asset: 'rETH', deposited: 1.2, apy: 4.8, earnings: 72, rewardToken: 'RPL', portfolioPercentage: 5 },
  { protocol: 'Synthetix', asset: 'sUSD', deposited: 2000, apy: 6.0, earnings: 120, rewardToken: 'SNX', portfolioPercentage: 10 },
];

export default function YieldPositionsTable() {
  const theme = useTheme();

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Yield Positions
      </Typography>
      <Card variant="outlined">
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Protocol</TableCell>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Deposited Amount</TableCell>
                  <TableCell align="right">APY (%)</TableCell>
                  <TableCell align="right">Earnings ($)</TableCell>
                  <TableCell align="right">Reward Token</TableCell>
                  <TableCell align="right">% of Portfolio</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {yieldData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.protocol}</TableCell>
                    <TableCell>{row.asset}</TableCell>
                    <TableCell align="right">{row.deposited.toLocaleString()}</TableCell>
                    <TableCell align="right" sx={{ color: row.apy >= 5 ? 'green' : 'blue' }}>
                      {row.apy}%
                    </TableCell>
                    <TableCell align="right">{row.earnings.toLocaleString()}</TableCell>
                    <TableCell align="right">{row.rewardToken}</TableCell>
                    <TableCell align="right">{row.portfolioPercentage}%</TableCell>
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
