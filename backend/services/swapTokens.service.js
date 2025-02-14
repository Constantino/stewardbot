const Safe = require("@safe-global/protocol-kit");
const dotenv = require("dotenv");
const {
  Address,
  createPublicClient,
  createWalletClient,
  defineChain,
  encodeFunctionData,
  http,
  PublicClient,
} = require("viem");

const { privateKeyToAccount } = require("viem/accounts");
// const ERC20_ABI = require("../utils/abi/erc20");
const WETH_ABI = require("../utils/abi/weth");
const WAVAX_ABI = require("../utils/abi/erc20");
const { Token } = require("@uniswap/sdk-core");
const {
  FeeAmount,
  Pool,
  Route,
  SwapRouter,
  Trade,
} = require("@uniswap/v3-sdk");
const { TradeType, CurrencyAmount, Percent } = require("@uniswap/sdk-core");
const JSBI = require("jsbi");
const POOL_ABI = require("../utils/abi/pool");
const {
  OperationType,
  MetaTransactionData,
} = require("@safe-global/types-kit");

// Load environment variables
dotenv.config();

// Constants
const NETWORKS = {
  arbitrum: { chainId: 42161, rpcUrl: process.env.ARBITRUM_RPC_URL },
  avalanche: { chainId: 43114, rpcUrl: process.env.AVALANCHE_RPC_URL },
  sepolia: { chainId: 11155111, rpcUrl: process.env.SEPOLIA_RPC_URL },
};

// Only Uniswap V3 supported for now
const SWAP_ROUTER_ADDRESSES = {
  avalanche: "0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE",
  arbitrum: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
};

// Token addresses
const TOKEN_ADDRESSES = {
  arbitrum: {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    GRT: "0x9623063377AD1B27544C965cCd7342f7EA7e88C7",
    LINK: "0xf97f4df75117a78c1A5a0DBb814Af92458539FB4",
    AAVE: "0xba5DdD1f9d7F570dc94a51479a000E3BCE967196",
    CRV: "0x11cDb42B0EB46D95f990BeDD4695A6e3fA034978",
  },
  avalanche: {
    WETH: "0x8b82A291F83ca07Af22120ABa21632088fC92931",
    WETHe: "0x49d5c2bdffac6ce2bfdb6640f4f80f226bc10bab",
    WAVAX: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
    USDC: "x01",
  },
};

const POOL_ADDRESSES = {
  arbitrum: {
    WETH_USDC: "0xC6962004f452bE9203591991D15f6b388e09E8D0",
    WETH_GRT: "0x74d0Ae8B8e1fCA6039707564704a25aD2ee036B0",
    WETH_LINK: "0x468b88941e7Cc0B88c1869d68ab6b570bCEF62Ff",
    WETH_AAVE: "0xDD672b3B768A16b9BcB4eE1060d3e8221435BeAa",
    WETH_CRV: "0xa95b0F5a65a769d82AB4F3e82842E45B8bbAf101",
  },
  avalanche: {
    AVAX_WETHe: "0x724f6a02ED2eB82D8d45034B280903cf663731Ab",
  },
};

// TODO: Change hardcoded portfolio value to real value
const PORTFOLIO_TOTAL_IN_USD = 3;

/**
 * Fetch Uniswap pool data
 */
const fetchPoolData = async (publicClient, poolAddress) => {
  const slot0 = await publicClient.readContract({
    address: poolAddress,
    abi: POOL_ABI.abi,
    functionName: "slot0",
  });

  console.log("slot0: ", slot0);

  const liquidity = await publicClient.readContract({
    address: poolAddress,
    abi: POOL_ABI.abi,
    functionName: "liquidity",
  });

  console.log("liquidity: ", liquidity);

  return {
    sqrtPriceX96: BigInt(slot0[0]),
    tick: slot0[1],
    liquidity: BigInt(liquidity),
  };
};

/**
 * Execute a swap on Uniswap via Safe Wallet
 */
const executeSwapService = async ({
  buyToken,
  sellToken,
  network,
  percentage,
}) => {
  if (!NETWORKS[network]) {
    throw new Error(
      "Unsupported network. Choose from: arbitrum, avalanche, sepolia."
    );
  }

  const { chainId, rpcUrl } = NETWORKS[network];
  const { SAFE_ADDRESS, SIGNER_PRIVATE_KEY } = process.env;

  if (!SAFE_ADDRESS || !SIGNER_PRIVATE_KEY || !rpcUrl) {
    throw new Error("Missing required environment variables.");
  }

  // Calculate swap amount
  const swapAmountUSD = (percentage / 100) * PORTFOLIO_TOTAL_IN_USD;

  console.log(
    `Swapping ${swapAmountUSD} USD worth of ${sellToken} for ${buyToken} on ${network}`
  );

  // Setup clients
  const customChain = defineChain({
    id: chainId,
    name: network,
    transport: http(rpcUrl),
  });
  const account = privateKeyToAccount(SIGNER_PRIVATE_KEY);

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
    chain: customChain,
  });

  const walletClient = createWalletClient({
    transport: http(rpcUrl),
    chain: customChain,
  });

  // Initialize Safe
  const protocolKit = await Safe.default.init({
    provider: rpcUrl,
    signer: SIGNER_PRIVATE_KEY,
    safeAddress: SAFE_ADDRESS,
  });

  if (!(await protocolKit.isSafeDeployed())) {
    throw new Error("Safe not deployed.");
  }

  const SWAP_ROUTER_ADDRESS = SWAP_ROUTER_ADDRESSES[network];

  // const INPUT_AMOUNT = swapAmountUSD.toString();
  // 100000000000000
  // 90000000000000
  // 00000100000000000
  // 5000000000000 aprox 0.01 USD
  // 10000000000000 aprox 0.03 USD
  const INPUT_AMOUNT = "5000000000000";
  const OUTPUT_AMOUNT = "0"; // 0 USDC

  const tokenSellAddress = TOKEN_ADDRESSES[network][sellToken];
  const tokenBuyAddress = TOKEN_ADDRESSES[network][buyToken];

  if (!tokenSellAddress || !tokenBuyAddress) {
    throw new Error("Invalid token selection.");
  }

  // Define token details
  const sellTokenInstance = new Token(
    chainId,
    tokenSellAddress,
    sellToken === "USDC" ? 6 : 18, // Adjust decimals depending on USDC or token
    sellToken,
    sellToken
  );

  const buyTokenInstance = new Token(
    chainId,
    tokenBuyAddress,
    buyToken === "USDC" ? 6 : 18, // Adjust decimals depending on USDC or token
    buyToken,
    buyToken
  );
  console.log("checkpoint 7");
  // Fetch Pool Data

  let poolAddress;
  if (network === "arbitrum") {
    poolAddress = POOL_ADDRESSES[network][`WETH_${buyToken}`];
  } else if (network === "avalanche") {
    console.log("USING AVALANCHEEEEEEEEEEEEEEEEEEEEEE");
    poolAddress = POOL_ADDRESSES[network][`AVAX_${buyToken}`];
  } else {
    throw new Error(
      "Unsupported network. Only 'arbitrum' and 'avalanche' supported at the moment."
    );
  }

  const poolInfo = await fetchPoolData(publicClient, poolAddress);
  console.log("checkpoint 8");
  // Create the pool object
  const pool = new Pool(
    sellTokenInstance,
    buyTokenInstance,
    FeeAmount.MEDIUM,
    JSBI.BigInt(poolInfo.sqrtPriceX96.toString()),
    JSBI.BigInt(poolInfo.liquidity.toString()),
    poolInfo.tick
  );
  console.log("checkpoint 9");
  const swapRoute = new Route([pool], sellTokenInstance, buyTokenInstance);
  console.log("checkpoint 10");
  const uncheckedTrade = Trade.createUncheckedTrade({
    tradeType: TradeType.EXACT_INPUT,
    route: swapRoute,
    inputAmount: CurrencyAmount.fromRawAmount(sellTokenInstance, INPUT_AMOUNT),
    outputAmount: CurrencyAmount.fromRawAmount(buyTokenInstance, OUTPUT_AMOUNT),
  });
  console.log("checkpoint 11");
  const options = {
    slippageTolerance: new Percent(50, 10_000), // 0.50%
    deadline: Math.floor(Date.now() / 1000) + 60 * 20, // 20 minutes
    recipient: SAFE_ADDRESS,
  };
  console.log("checkpoint 12");
  const methodParameters = SwapRouter.swapCallParameters(
    [uncheckedTrade],
    options
  );
  console.log("checkpoint 13");
  // Create transaction **** ISSUES BEGIN HERE ****

  const callDataDeposit = encodeFunctionData({
    abi: WETH_ABI.WETH_ABI,
    functionName: "deposit",
    args: [],
  });

  let safeDepositTx = {};
  if (network === "arbitrum") {
    safeDepositTx = {
      to: TOKEN_ADDRESSES[network]["WETH"],
      value: INPUT_AMOUNT,
      data: callDataDeposit,
      operation: OperationType.Call,
    };
  } else {
    safeDepositTx = {
      to: TOKEN_ADDRESSES[network]["WAVAX"],
      value: INPUT_AMOUNT,
      data: callDataDeposit,
      operation: OperationType.Call,
    };
  }

  const callDataApprove = encodeFunctionData({
    abi: sellToken === "WAVAX" ? WAVAX_ABI.erc20Abi : WETH_ABI.WETH_ABI,
    functionName: "approve",
    args: [SWAP_ROUTER_ADDRESS, INPUT_AMOUNT],
  });

  console.log("THE CALL DATA APPROVE", callDataApprove);
  console.log("******************************************************");

  const safeApproveTx = {
    to: TOKEN_ADDRESSES[network][sellToken],
    value: "0",
    data: callDataApprove,
    operation: OperationType.Call,
  };

  const safeSwapTx = {
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    data: methodParameters.calldata,
    operation: OperationType.Call,
  };

  console.log("Executing swap...🔄🔄🔄");

  // console.log("safeDepositTx: ", safeDepositTx);
  // console.log("safeApproveTx: ", safeApproveTx);
  // console.log("safeSwapTx: ", safeSwapTx);

  // If selling WETH we need to send the deposit, approve and swap txns
  // otherwise we only need the swap txn

  if (sellToken === "WETH") {
    safeTx = await protocolKit.createTransaction({
      transactions: [safeDepositTx, safeApproveTx, safeSwapTx],
      onlyCalls: true,
    });
  } else {
    safeTx = await protocolKit.createTransaction({
      transactions: [safeApproveTx, safeSwapTx],
      onlyCalls: true,
    });
  }

  const signedSafeTx = await protocolKit.signTransaction(safeTx);

  console.log("Tx signed");
  // Execute the transaction after signing
  console.log("execute after signed");
  const txResponse = await protocolKit.executeTransaction(signedSafeTx);
  console.log("awaiting tx receipt");
  await publicClient.waitForTransactionReceipt({ hash: txResponse.hash });

  console.log(`Swap executed successfully: [${txResponse.hash}]`);

  return { success: true, transactionHash: txResponse.hash };
};

const checkPoolBalanceService = async (poolAddress, network) => {
  if (!NETWORKS[network]) {
    throw new Error("Unsupported network.");
  }

  const { rpcUrl } = NETWORKS[network];

  const publicClient = createPublicClient({
    transport: http(rpcUrl),
    chain: defineChain({ id: NETWORKS[network].chainId }),
  });
  const poolData = await fetchPoolData(publicClient, poolAddress);

  return {
    sqrtPriceX96: poolData.sqrtPriceX96.toString(),
    tick: poolData.tick,
    liquidity: poolData.liquidity.toString(),
  };
};

module.exports = {
  checkPoolBalanceService,
  executeSwapService,
};
