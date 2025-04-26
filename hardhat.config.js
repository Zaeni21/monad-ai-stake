require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    monadTestnet: {
      url: "https://rpc.testnet.monad.xyz", // RPC URL Monad Testnet
      accounts: [process.env.PRIVATE_KEY], // Private Key kamu (diambil dari GitHub Secrets)
      chainId: 2710, // Chain ID Monad Testnet
    }
  }
};
