import { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

type PortfolioData = {
  name: string;
  symbol: string;
  amount: number;
  price: number;
}[];

export default function PortfolioWatch({ portfolioData }: { portfolioData: PortfolioData }) {
  const theme = useTheme();
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    if (portfolioData.length > 0) {
      // 1. Calculate total portfolio value
      const totalValue = portfolioData.reduce(
        (acc, token) => acc + token.amount * token.price,
        0
      );

      // 2. Calculate the percentage for each token
      const formattedData = portfolioData.map((token, index) => ({
        id: index, // Unique ID for PieChart
        value: ((token.amount * token.price) / totalValue) * 100, // Percentage of portfolio
        label: token.symbol.toUpperCase(), // Label for PieChart
      }));

      setPieChartData(formattedData);
    }
  }, [portfolioData]);


  // Data for the Line Chart
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  const lineData = [10, 25, 18, 40, 30, 50, 45];

  // Data for the Pie Chart
  const pieData = [
    { id: 1, value: 30, label: 'Tech' },
    { id: 2, value: 25, label: 'Finance' },
    { id: 3, value: 20, label: 'Health' },
    { id: 4, value: 15, label: 'Energy' },
    { id: 5, value: 10, label: 'Consumer Goods' },
  ];

  // Shades of the same color for the Pie Chart
  const baseColor = theme.palette.primary.main;
  const pieColors = [
    theme.palette.primary.light,
    theme.palette.primary.main,
    theme.palette.primary.dark,
    theme.palette.secondary.light,
    theme.palette.secondary.dark,
  ];

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Portfolio Watch
      </Typography>
      <Grid container spacing={2}>
        {/* Line Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Overall Performance
              </Typography>
              <LineChart
                xAxis={[{ scaleType: 'band', data: months }]}
                series={[
                  {
                    data: lineData,
                    color: theme.palette.primary.main, // Blue line
                    showMark: true,
                  },
                ]}
                width={500}
                height={250}
                grid={{ vertical: false, horizontal: true }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Pie Chart */}
        <Grid item xs={12} md={6}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="subtitle2" gutterBottom>
                Asset Allocation
              </Typography>
              <PieChart
                series={[{ data: pieChartData }]}
                width={500}
                height={250}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
