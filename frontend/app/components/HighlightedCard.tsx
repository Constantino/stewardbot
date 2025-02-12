import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

export default function HighlightedCard() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Card sx={{ height: '100%' }} variant="outlined">
      <CardContent>
        <InsightsRoundedIcon />
        <Typography component="h2" variant="subtitle2" gutterBottom sx={{ fontWeight: '600' }}>
          Go Pro
        </Typography>
        <Typography sx={{ color: 'text.secondary', mb: '8px' }}>
          Join our exclusive waitlist to be the 1st to try our newest yield strategies and features.
        </Typography>
        <Link href="https://stewardbot.xyz/" target='_blank'>
          <Button
            variant="contained"
            size="small"
            color="primary"
            endIcon={<ChevronRightRoundedIcon />}
            fullWidth={isSmallScreen}
          >
            Let Me In!
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}