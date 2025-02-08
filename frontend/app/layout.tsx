import * as React from 'react';
import { NextAppProvider } from '@toolpad/core/nextjs';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StackedLineChartIcon from '@mui/icons-material/StackedLineChart';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import type { Navigation } from '@toolpad/core/AppProvider';
import LinearProgress from '@mui/material/LinearProgress';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import theme from '../theme';

const NAVIGATION: Navigation = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: '',
    title: 'Agent',
    icon: <SmartToyIcon />,
  },
  {
    segment: 'portfolio',
    title: 'Portfolio',
    icon: <StackedLineChartIcon />,
  },
  {
    segment: 'positions',
    title: 'Positions',
    icon: <MonetizationOnIcon />,
  },
  {
    segment: 'yield-farming',
    title: 'Yield Farming',
    icon: <AgricultureIcon />,
  },
];

const branding = {
  title: 'StewardBot',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <head>
        <title>🤖 StewardBot v0.1</title>
      </head>
      <body>
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <React.Suspense fallback={<LinearProgress />}>
            <NextAppProvider theme={theme} navigation={NAVIGATION} branding={branding}>
              {children}
            </NextAppProvider>
          </React.Suspense>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
