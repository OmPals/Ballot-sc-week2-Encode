import { ethers } from "hardhat"

const main = async (_proposalIndex: number) => {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    const accounts = await ethers.getSigners();
    const chairperson = accounts[0];
    
    const ballotContract = ballotFactory.attach("0x5896DF9B5d3d0967BE056E7e2cC1d8A7E57437D1");

    const winner = await ballotContract.winnerName();
    console.log(ethers.utils.parseBytes32String(winner));
}


const proposalIndex: number = parseInt(process.env.proposalIndex!)
main(proposalIndex)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

