export const fetchTokenPrices = async (tokens) => {
  // Map symbols to CoinGecko IDs (You might need a more extensive mapping)
  const coingeckoIds = {
    aave: "aave",
    link: "chainlink",
    grt: "the-graph",
  };

  // Map token symbols to valid CoinGecko IDs
  const ids = tokens
    .map((token) => coingeckoIds[token.symbol.toLowerCase()])
    .filter(Boolean) // Remove undefined values
    .join(",");

  if (!ids) return tokens.map((token) => ({ ...token, price: 0 })); // Fallback in case no valid IDs

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`
    );
    const data = await response.json();
    return tokens.map((token) => ({
      ...token,
      price: data[coingeckoIds[token.symbol.toLowerCase()]]?.usd || 0,
    }));
  } catch (error) {
    console.error("Error fetching prices:", error);
    return tokens.map((token) => ({ ...token, price: 0 }));
  }
};

// Example Usage
fetchTokenPrices([
  { symbol: "aave", amount: 15 },
  { symbol: "link", amount: 35 },
  { symbol: "grt", amount: 500 },
]).then(console.log);
