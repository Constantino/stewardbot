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

const NETWORKS = {
  arbitrum: { chainId: 42161, rpcUrl: process.env.ARBITRUM_RPC_URL },
  avalanche: { chainId: 43114, rpcUrl: process.env.AVALANCHE_RPC_URL },
  sepolia: { chainId: 11155111, rpcUrl: process.env.SEPOLIA_RPC_URL },
};

// TODO: Change hardcoded portfolio value to real value
const PORTFOLIO_TOTAL_IN_USD = 1000;

/**
 * Fetch Uniswap pool data
 */
const fetchPoolData = async (publicClient, poolAddress) => {
  console.log("begin");
  console.log("publicClient: ", publicClient)
  console.log("poolAddress: ", poolAddress)
  console.log("pool abi: ", POOL_ABI.abi)

  const slot0 = await publicClient.readContract({
    address: poolAddress,
    abi: POOL_ABI.abi,
    functionName: "slot0",
  });

  console.log("slot0: ", slot0)

  const liquidity = await publicClient.readContract({
    address: poolAddress,
    abi: POOL_ABI.abi,
    functionName: "liquidity",
  });

  console.log("liquidity: ", liquidity)

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

  // Token addresses (Replace with actual token addresses per network)
  const TOKEN_ADDRESSES = {
    WETH: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
  };

  const SWAP_ROUTER_ADDRESS = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // Uniswap V3 Router

  // const INPUT_AMOUNT = swapAmountUSD.toString();
  // 100000000000000
  // 90000000000000
  // 00000100000000000
  const INPUT_AMOUNT = "1000000000";
  const OUTPUT_AMOUNT = "0"; // 0 USDC

  const tokenSellAddress = TOKEN_ADDRESSES[sellToken];
  const tokenBuyAddress = TOKEN_ADDRESSES[buyToken];

  if (!tokenSellAddress || !tokenBuyAddress) {
    throw new Error("Invalid token selection.");
  }

  // Define token details
  const sellTokenInstance = new Token(
    chainId,
    tokenSellAddress,
    18,
    sellToken,
    sellToken
  );

  const buyTokenInstance = new Token(
    chainId,
    tokenBuyAddress,
    6,
    buyToken,
    buyToken
  );
  console.log("checkpoint 7");
  // Fetch Pool Data
  const poolAddress = "0xC6962004f452bE9203591991D15f6b388e09E8D0"; // Adjust per pair

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
  // Create transaction

  const callDataApprove = encodeFunctionData({
    abi: WETH_ABI.WETH_ABI,
    functionName: "approve",
    args: [SWAP_ROUTER_ADDRESS, INPUT_AMOUNT],
  });

  const callDataDeposit = encodeFunctionData({
    abi: WETH_ABI.WETH_ABI,
    functionName: "deposit",
    args: [],
  });

  const safeSwapTx = {
    to: SWAP_ROUTER_ADDRESS,
    value: methodParameters.value,
    data: methodParameters.calldata,
    operation: OperationType.Call,
  };
  const safeApproveTx = {
    to: TOKEN_ADDRESSES["WETH"],
    value: "0",
    data: callDataApprove,
    operation: OperationType.Call,
  };
  const safeDepositTx = {
    to: TOKEN_ADDRESSES["WETH"],
    value: INPUT_AMOUNT,
    data: callDataDeposit,
    operation: OperationType.Call,
  };
  console.log("checkpoint 14");

  console.log("weth abi: ", WETH_ABI.WETH_ABI);

  console.log("Executing swap...🔄");

  console.log("safeDepositTx: ", safeDepositTx)
  console.log("safeApproveTx: ", safeApproveTx)
  console.log("safeSwapTx: ", safeSwapTx)

  const safeTx = await protocolKit.createTransaction({
    transactions: [safeDepositTx, safeApproveTx, safeSwapTx],
    onlyCalls: true,
  });

  console.log("Tx created: ", safeTx);

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
