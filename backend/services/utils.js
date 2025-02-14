const { OperationType } = require("@safe-global/types-kit");

async function executeGnosisSafeTx(unsignedTx, safeSdk) {
  const safeTransactionData = {
    to: unsignedTx.to,
    data: unsignedTx.data || "0x",
    value: unsignedTx.value
      ? `0x${BigInt(unsignedTx.value).toString(16)}`
      : "0x0",
    operation: OperationType.Call,
  };

  const safeTx = await safeSdk.createTransaction({
    transactions: [safeTransactionData],
    onlyCalls: true,
  });

  const signedSafeTx = await safeSdk.signTransaction(safeTx);

  const txResponse = await safeSdk.executeTransaction(signedSafeTx);

  // Wait for confirmation
  //    If you have a "publicClient" from `viem` or a Provider from `ethers`,
  //    wait for receipt. Example with ethers:
  // const receipt = await provider.waitForTransaction(txResponse.hash);
  // console.log("TX mined", receipt);

  return txResponse.hash;
}

module.exports = {
  executeGnosisSafeTx,
};
