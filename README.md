# Ballot Smart Contract

Ballot Smart Contract can be found here in this repo: contracts\Ballot.sol

Testing it locally: 
```shell
yarn hardhat test
REPORT_GAS=true npx hardhat test
```
Adding a .env file to the root folder: 
```
MNEMONIC=""
PRIVATE_KEY=""
INFURA_API_KEY=""
INFURA_API_SECRET=""
ALCHEMY_API_KEY=""
ETHERSCAN_API_KEY=""

GOERLI_RPC_URL=""
ALCHEMY_RPC_URL=""
```

Deployment Script: 
```
npx hardhat run scripts\Deployment.ts --network <network>
```
