import { ethers, network } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"

const main = async (_to: Address) => {
  const ballotFactory = await ethers.getContractFactory("Ballot");
    const accounts = await ethers.getSigners();
    const chairperson = accounts[0];
    const voter = accounts[1];

    console.log(voter.address);

    console.log("ChaineId: ", network.config.chainId);

    const ballotContract = await ballotFactory.attach("0x5896DF9B5d3d0967BE056E7e2cC1d8A7E57437D1");

    console.log(await ballotContract.chairperson());

    await ballotContract
      // .connect(chairperson)
      .giveRightToVote("voter.address");

    const voter1 = await ballotContract.voters(accounts[1].address);

    console.log(voter1.weight);
}

main(process.env.give_right_to!)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })