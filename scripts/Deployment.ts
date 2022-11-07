import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  console.log("[");
  for (let index = 0; index < array.length; index++) {
    const a = ethers.utils.formatBytes32String(array[index]);
    console.log("\"" + a + "\",");
    
    bytes32Array.push(a);
  }

  console.log("]");
  return bytes32Array;
}

async function main() {
  console.log("Deploying Ballot contract");
  console.log("Proposals: ");
  PROPOSALS.forEach((element, index) => {
    console.log(`Proposal N. ${index + 1}: ${element}`);
  });
  
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());
  const ballotFactory = await ethers.getContractFactory("Ballot");
  const ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
  );
  await ballotContract.deployed();

  console.log("Ballot contract is deployed on: ", ballotContract.address);


  // const Token = await ethers.getContractFactory("HelloWorld");
  // const token = await Token.deploy();

  // console.log("Token address:", token.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
