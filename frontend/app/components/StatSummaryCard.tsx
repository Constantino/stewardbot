import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { SparkLineChart } from '@mui/x-charts/SparkLineChart';
import { areaElementClasses } from '@mui/x-charts/LineChart';

export type StatSummaryCardProps = {
  title: string;
  percentage: number;
  amount: string;
  data: number[];
};

export default function StatSummaryCard({ title, percentage, amount, data }: StatSummaryCardProps) {
  const theme = useTheme();
  const isPositive = percentage >= 0;
  const percentageColor = isPositive ? theme.palette.success.main : theme.palette.error.main;
  const chipColor = isPositive ? 'success' : 'error';
  const gradientId = `area-gradient-${title.replace(/\s+/g, '-')}`;

  return (
    <Card variant="outlined" sx={{ height: '100%', flexGrow: 1 }}>
      <CardContent>
        <Typography component="h2" variant="subtitle2" gutterBottom>
          {title}
        </Typography>
        <Stack direction="column" sx={{ justifyContent: 'space-between', flexGrow: '1', gap: 1 }}>
          <Stack sx={{ justifyContent: 'space-between' }}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h5" component="p" sx={{ color: percentageColor }}>
                {amount}
              </Typography>
              <Chip size="medium" color={chipColor} label={`${percentage}%`} />
            </Stack>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              More Info:
            </Typography>
          </Stack>
          <Box sx={{ width: '100%', height: 50 }}>
            {/* Move the <defs> outside the chart */}
            <svg width="0" height="0">
              <defs>
                <linearGradient id={gradientId} x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor={percentageColor} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={percentageColor} stopOpacity={0} />
                </linearGradient>
              </defs>
            </svg>

            <SparkLineChart
              colors={[percentageColor]}
              data={data}
              area
              showHighlight
              showTooltip
              xAxis={{ scaleType: 'band', data: Array.from({ length: data.length }, (_, i) => i + 1) }}
              sx={{
                [`& .${areaElementClasses.root}`]: {
                  fill: `url(#${gradientId})`,
                },
              }}
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
