import { ethers, network } from "hardhat"
import { Address } from "hardhat-deploy/dist/types"

// voter2 -> voter1

const main = async (_to: Address) => {
  const ballotFactory = await ethers.getContractFactory("Ballot");
    const accounts = await ethers.getSigners();
    
    const chairperson = accounts[0];
    
    const voter1 = accounts[1];
    const voter2 = accounts[2];

    console.log(voter1.address);
    console.log(voter2.address);

    console.log("ChaineId: ", network.config.chainId);

    const ballotContract = await ballotFactory.attach("0x5896DF9B5d3d0967BE056E7e2cC1d8A7E57437D1");

    console.log(await ballotContract.chairperson());

    // await ballotContract
    //     .connect(voter2)
    //     .delegate(voter1.address);

    const a  = await ballotContract.voters("0xB0f7100af8786FaD6217A89230c27745231Df6d1");
    console.log(a);
}

main(process.env.give_right_to!)
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })