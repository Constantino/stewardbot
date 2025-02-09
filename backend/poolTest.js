const SWAP_ROUTER_ADDRESSES = {
  avalanche: "0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE",
  arbitrum: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
};

console.log(SWAP_ROUTER_ADDRESSES["arbitrum"]);

const TOKEN_ADDRESSES = {
  arbitrum: {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  },
  avalanche: {
    WETH: "x01",
    USDC: "x01",
  },
};

console.log(TOKEN_ADDRESSES["arbitrum"]["USDC"]);
console.log(TOKEN_ADDRESSES["avalanche"]["USDC"]);
