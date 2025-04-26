require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    monadTestnet: {
      url: "https://rpc.testnet.monad.xyz",
      accounts: ["8a3d86a561532e7d621715aedbff27a8ab90b1f3c298fefcd7862886a627beca"], // <<< GANTI MANUAL DI SINI
      chainId: 2710,
    }
  }
};
