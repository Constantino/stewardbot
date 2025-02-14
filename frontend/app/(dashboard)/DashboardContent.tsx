// @ts-nocheck
'use client';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import StatCard, { StatCardProps } from '../components/StatCard';
import HighlightedCard from '../components/HighlightedCard';
import StatSummaryCard from '../components/StatSummaryCard';
import PortfolioWatch from '../components/PortfolioWatch';
import PositionsTable from '../components/PositionsTable';
import YieldPositionsTable from '../components/YieldPositionsTable';
import { useState, useEffect } from 'react';
// import SessionsChart from '../components/SessionsChart';
// import PageViewsBarChart from '../components/PageViewsBarChart';
// import CustomTreeView from '../components/CustomTreeView';
// import ChartUserByCountry from '../components/ChartUserByCountry';
import { fetchTokenPrices } from '../utils/api';

const data: StatCardProps[] = [
  {
    title: 'Winning Trades',
    value: '14k',
    interval: 'Last 30 days',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380, 360, 400, 380,
      420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Losing Trades',
    value: '325',
    interval: 'Last 30 days',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820, 780, 800, 760,
      380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  {
    title: 'Event count',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530, 520, 410, 530,
      520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
];

const summaryData = [
  {
    title: 'Historical',
    percentage: -30,
    amount: '-$1,200.00',
    data: [400, 380, 360, 300, 250, 200, 150, 100, 80, 50],
  },
  {
    title: '1 Year',
    percentage: 23,
    amount: '$3,500.00',
    data: [50, 80, 100, 150, 200, 250, 300, 360, 380, 400],
  },
  {
    title: '30 Days',
    percentage: -12,
    amount: '-$850.00',
    data: [200, 180, 160, 140, 120, 100, 80, 60, 40, 20],
  },
  {
    title: '7 Days',
    percentage: 8,
    amount: '$303.00',
    data: [20, 40, 60, 80, 100, 120, 140, 160, 180, 200],
  },
];

export default function DashboardContent() {
  const [tokensInMyWallet, setTokensInMyWallet] = useState([]);
  const [portfolioData, setPortfolioData] = useState([]);
  const [mainData, setMainData] = useState()
  const [tokenList, setTokenList] = useState([])
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  useEffect( () => {

    async function bringData() {
      
      // Simulating fetching wallet tokens from backend
      // setTimeout(() => {
      //   const walletTokens = [
      //     { symbol: "aave", amount: 2 },
      //     { symbol: "link", amount: 35 },
      //     { symbol: "grt", amount: 800 },
      //   ];
      //   setTokensInMyWallet(walletTokens);
  
      //   // Fetch prices for the tokens
      //   fetchTokenPrices(walletTokens).then(setPortfolioData);
      // }, 1000);

      let arrHistoricalPrices = {}
  
      const myHeaders1 = new Headers();
      myHeaders1.append("accept", "application/json");
      // myHeaders1.append("Content-Type", "application/json");
      myHeaders1.append("x-client-id", process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID);
  
      const response1 = await fetch("https://1.insight.thirdweb.com/v1/tokens/erc20/0x6eC45c239C714271590D1aa45B86d54965bC1dA2?chain=42161", 
        {
          method: "GET",
          headers: myHeaders1
        }
      )
  
      let res1 = await response1.json();
      console.log("tokensHolded: ", res1.data); 
      let tokensHolded = res1.data;
      let arrTokens = []

      tokensHolded.forEach((element) => { 
        arrHistoricalPrices[element.tokenAddress] = {
          "balance": element.balance
        }
        arrTokens.push({["token_address"]: element.tokenAddress})
      })

      console.log("arrTokens: ", arrTokens)

      setTokenList(arrTokens)
  
      let raw = JSON.stringify(
        {
          "tokens": arrTokens
        }
      );
  
      console.log("raw: ", raw )

      const myHeaders2 = new Headers();
      myHeaders2.append("Content-Type", "application/json");
      myHeaders2.append("X-API-Key", process.env.NEXT_PUBLIC_MORALIS_API_KEY);
  
      const response2 = await fetch("https://deep-index.moralis.io/api/v2.2/erc20/prices?chain=arbitrum&include=percent_change", 
        {
          method: "POST",
          headers: myHeaders2,
          body: raw,
          redirect: "follow"
        }
      )
  
      let res2 = await response2.json();
  
      console.log("prices of tokens holded: ", res2); 
      let tokenPrices = res2;

      

      const myHeaders3 = new Headers();
      myHeaders3.append("accept", "application/json");
      myHeaders3.append("X-API-Key", process.env.NEXT_PUBLIC_MORALIS_API_KEY);

      for(let i = 0; i < tokenPrices.length; i++) {
        arrHistoricalPrices[tokenPrices[i].tokenAddress].price = tokenPrices[i].usdPrice
        arrHistoricalPrices[tokenPrices[i].tokenAddress].tokenName = tokenPrices[i].tokenName
        arrHistoricalPrices[tokenPrices[i].tokenAddress].tokenSymbol = tokenPrices[i].tokenSymbol
        arrHistoricalPrices[tokenPrices[i].tokenAddress].tokenDecimals = tokenPrices[i].tokenDecimals

        if(i == (tokenPrices.length -1) ) {
          setIsDataLoaded(true);
        }
        // setTimeout(async () => {
          

        //   const response3 = await fetch(`https://deep-index.moralis.io/api/v2.2/pairs/${tokenPrices[i].pairAddress}/ohlcv?chain=arbitrum&timeframe=1d&currency=usd&fromDate=2025-01-13&toDate=2025-02-13`, 
        //     {
        //       method: "GET",
        //       headers: myHeaders3
        //     }
        //   )
  
        //   let res3 = await response3.json();
      
        //   console.log("historicalPrices: ", res3); 
    
        //   arrHistoricalPrices[res3.tokenAddress].historicalPrices = res3
  
  
        //   console.log("waiting 1 s")

          

        // }, i*1100);

      }
  
      
      console.log("arrHistoricalPrices: ", arrHistoricalPrices)

      setMainData(arrHistoricalPrices)
    }
    
    bringData();
    
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          backgroundColor: theme.vars
            ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
            : alpha(theme.palette.background.default, 1),
          overflow: 'auto',
        })}
      >
        <Stack
          spacing={2}
          sx={{
            alignItems: 'center',
            mx: 3,
            pb: 5,
            mt: { xs: 8, md: 0 },
          }}
        >
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Overview
            </Typography>
            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              {data.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatCard {...card} />
                </Grid>
              ))}
              <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <HighlightedCard />
              </Grid>
              {/* 
              <Grid size={{ xs: 12, md: 6 }}>
                <SessionsChart />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <PageViewsBarChart />
              </Grid> */}
            </Grid>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
              Total Stats
            </Typography>
            <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
              {summaryData.map((card, index) => (
                <Grid key={index} size={{ xs: 12, sm: 6, lg: 3 }}>
                  <StatSummaryCard {...card} />
                </Grid>
              ))}
            </Grid>
            {
               (isDataLoaded) && 
                <PortfolioWatch portfolioData={mainData} tokenList={ tokenList } />
            }
            <PositionsTable />
            <YieldPositionsTable />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
}