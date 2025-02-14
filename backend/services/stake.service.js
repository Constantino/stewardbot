const axios = require("axios");
const { Wallet, ethers } = require("ethers");
const Safe = require("@safe-global/protocol-kit");
const { executeGnosisSafeTx } = require("./utils");

const { SAFE_ADDRESS, SIGNER_PRIVATE_KEY, ARBITRUM_RPC_URL, STAKEKIT_API_KEY } =
  process.env;

// const provider = ethers.JsonRpcProvider(ARBITRUM_RPC_URL);
// const wallet = ethers.Wallet(PRIVATE_KEY, provider);

// provider = new ethers.providers.JsonRpcProvider(ARBITRUM_RPC_URL);
let wallet = new ethers.JsonRpcProvider(ARBITRUM_RPC_URL);

console.log("ethers", wallet);

const processStaking = async () => {
  try {
    console.log(">>> Starting staking process...");

    const provider = new ethers.JsonRpcProvider(ARBITRUM_RPC_URL);
    const wallet = new Wallet(SIGNER_PRIVATE_KEY, provider);

    console.log("Wallet address:", wallet.address);
    console.log("Safe address:", SAFE_ADDRESS);

    // const safeSdk = await Safe.default.init({
    //   provider: ARBITRUM_RPC_URL, // Or an ethers provider instance
    //   signer: SIGNER_PRIVATE_KEY,
    //   safeAddress: SAFE_ADDRESS,
    // });
    // if (!(await safeSdk.isSafeDeployed())) {
    //   throw new Error("Gnosis Safe not deployed!");
    // }

    const stakeSessionResponse = await axios.post(
      "https://api.stakek.it/v1/actions/enter",
      {
        integrationId: "arbitrum-grt-native-staking",
        addresses: { address: SAFE_ADDRESS }, // Use Safe address here
        args: {
          amount: "1",
          validatorAddress: "0xc55c63563efb36f7cc65ac3060c52987c6694b37", // taken from https://docs.stakek.it/docs/arbitrum-the-graph-native-staking
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-API-KEY": STAKEKIT_API_KEY,
        },
      }
    );

    console.log("STAKE_SESHH", stakeSessionResponse.data.transactions);

    // 3. Loop over each partial transaction
    for (const partialTx of stakeSessionResponse.data.transactions) {
      if (partialTx.status === "SKIPPED") {
        continue;
      }

      console.log(
        `Action ${partialTx.stepIndex + 1} of ${
          stakeSessionResponse.data.transactions.length
        } - ${partialTx.type}`
      );

      // 3a. Fetch recommended gas data
      const { data: gasResponse } = await axios.get(
        "https://api.stakek.it/v1/transactions/gas/arbitrum",
        {
          headers: {
            Accept: "application/json",
            "X-API-KEY": STAKEKIT_API_KEY,
          },
        }
      );

      // 3b. Construct the transaction on StakeKit
      //     The example picks `gasResponse.modes.values[1]`, but choose what suits you (0, 1, 2, etc.)
      // Couldn't find this in the docs, solo dejé 1 como valor
      const { data: constructedTransactionResponse } = await axios.patch(
        `https://api.stakek.it/v1/transactions/${partialTx.id}`,
        {
          gasArgs: gasResponse.modes.values[1].gasArgs,
        },
        {
          headers: {
            Accept: "application/json",
            "X-API-KEY": STAKEKIT_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      // 3c. Sign the returned unsigned transaction
      const unsignedTx = JSON.parse(
        constructedTransactionResponse.unsignedTransaction
      );
      const signedTransaction = await wallet.signTransaction(unsignedTx);

      // 3d. Submit signed transaction to StakeKit
      const { data: submitResponse } = await axios.post(
        `https://api.stakek.it/v1/transactions/${partialTx.id}/submit`,
        {
          signedTransaction: signedTransaction,
        },
        {
          headers: {
            Accept: "application/json",
            "X-API-KEY": STAKEKIT_API_KEY,
            "Content-Type": "application/json",
          },
        }
      );

      // 3e. Poll for transaction confirmation
      while (true) {
        const { data: statusResponse } = await axios.get(
          `https://api.stakek.it/v1/transactions/${partialTx.id}/status`,
          {
            headers: {
              Accept: "application/json",
              "X-API-KEY": API_KEY,
            },
          }
        );

        let resp = statusResponse;
        if (statusResponse.status === "CONFIRMED") {
          console.log("Transaction Confirmed:", statusResponse.url);
          break;
        } else if (statusResponse.status === "FAILED") {
          console.error("TRANSACTION FAILED");
          break;
        } else {
          console.log("Pending...");
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    console.log(">>> Staking process complete!");
    return resp;
  } catch (error) {
    console.error("Error: ", error.response ? error.response.data : error);
  }
};

module.exports = {
  processStaking,
};
