require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.19",
  networks: {
    monadTestnet: {
      url: "https://rpc.testnet.monad.xyz",
      accounts: ["8dfdf542b30189e53af4de78064d83c15df1fc2989489151d0b5486a4d129d9f"], // <<< GANTI MANUAL DI SINI
      chainId: 2710,
    }
  }
};
