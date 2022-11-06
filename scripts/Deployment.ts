import { ethers } from "hardhat";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function main() {
  // console.log("Deploying Ballot contract");
  // console.log("Proposals: ");
  // PROPOSALS.forEach((element, index) => {
  //   console.log(`Proposal N. ${index + 1}: ${element}`);
  // });
  
  // const ballotFactory = await ethers.getContractFactory("Ballot");
  // const ballotContract = await ballotFactory.deploy(
  //     convertStringArrayToBytes32(PROPOSALS)
  // );
  // await ballotContract.deployed();

  // console.log("Ballot contract is deployed on: ", ballotContract.address);

  const helloWorldFactory = await ethers.getContractFactory("HelloWorld");
    // accounts = await ethers.getSigners();
    // https://docs.ethers.io/v5/api/contract/contract-factory/#ContractFactory-deploy
    const helloWorldContract = await helloWorldFactory.deploy();

    console.log("HelloWorld contract is deploying on: ", helloWorldContract.address);

    // https://docs.ethers.io/v5/api/contract/contract/#Contract-deployed
    await helloWorldContract.deployed();

    console.log("HelloWorld contract is deployed on: ", helloWorldContract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
