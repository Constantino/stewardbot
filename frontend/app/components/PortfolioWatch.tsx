import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';

export default function PortfolioWatch() {
  const theme = useTheme();

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
                Sector Distribution
              </Typography>
              <PieChart
                series={[
                  {
                    data: pieData.map((item, index) => ({
                      ...item,
                      color: pieColors[index % pieColors.length], // Assign different shades
                    })),
                  },
                ]}
                width={400}
                height={250}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
