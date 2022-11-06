import * as dotenv from 'dotenv'
dotenv.config();

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  // const accounts = await hre.ethers.getSigners();

  console.log(process.env.ALCHEMY_RPC_URL);
  console.log(process.env.PRIVATE_KEY);

  // for (const account of accounts) {
  //   console.log(account.address);
  // }
});

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: { tests: "tests" },

  networks: {
    goerli: {
      url: process.env.GOERLI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    },
  },
  Etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;
