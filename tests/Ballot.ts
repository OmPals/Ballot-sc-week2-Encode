import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, network } from "hardhat";
import { Ballot } from "../typechain-types";

const PROPOSALS = ["Proposal 1", "Proposal 2", "Proposal 3"];

function convertStringArrayToBytes32(array: string[]) {
  const bytes32Array = [];
  for (let index = 0; index < array.length; index++) {
    bytes32Array.push(ethers.utils.formatBytes32String(array[index]));
  }
  return bytes32Array;
}

async function vote(ballotContract:Ballot, chairperson:SignerWithAddress, voterAccount:SignerWithAddress, toVote:number) {
  await ballotContract
    .connect(chairperson)
    .giveRightToVote(voterAccount.address);
      
        
  await ballotContract
    .connect(voterAccount)
    .vote(toVote);
}

describe("Ballot", function () {
  let ballotContract: Ballot;
  let accounts:SignerWithAddress[];
  let chairperson:SignerWithAddress;
  let attacker:SignerWithAddress;

  beforeEach(async function () {
    const ballotFactory = await ethers.getContractFactory("Ballot");
    accounts = await ethers.getSigners();
    chairperson = accounts[0];
    attacker = accounts[3];

    console.log("ChaineId: ", network.config.chainId);

    ballotContract = await ballotFactory.deploy(
      convertStringArrayToBytes32(PROPOSALS)
    );
    await ballotContract.deployed();
  });

  describe("when the contract is deployed", function () {
    it("has the provided proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect(ethers.utils.parseBytes32String(proposal.name)).to.eq(
          PROPOSALS[index]
        );
      }
    });

    it("has zero votes for all proposals", async function () {
      for (let index = 0; index < PROPOSALS.length; index++) {
        const proposal = await ballotContract.proposals(index);
        expect((proposal.voteCount)).to.eq(0);
      }
    });
    it("sets the deployer address as chairperson", async function () {
      const contractOwner = await ballotContract.chairperson();
      expect(contractOwner).to.equal(chairperson.address);
    });
    it("sets the voting weight for the chairperson as 1", async function () {
      const chairpersonVoter = await ballotContract.voters(accounts[0].address);
      expect(chairpersonVoter.weight).to.eq(1);
    });
  });

  describe("when the chairperson interacts with the giveRightToVote function in the contract", function () {
    it("gives right to vote for another address", async function () {
      await ballotContract
        .connect(chairperson)
        .giveRightToVote(accounts[1].address);
      
      const voter1 = await ballotContract.voters(accounts[1].address);
      expect(voter1.weight).to.eq(1);
    });
    it("can not give right to vote for someone that has voted", async function () {
      const voter = accounts[1];
      await ballotContract
        .connect(chairperson)
        .giveRightToVote(voter.address);
      
      await ballotContract
        .connect(voter)
        .vote(0);
      
      await expect(ballotContract
        .connect(chairperson)
        .giveRightToVote(voter.address))
        .to.be.revertedWith("The voter already voted.");
    });
    it("can not give right to vote for someone that has already voting rights", async function () {
      const voter = accounts[1];
      await ballotContract
        .connect(chairperson)
        .giveRightToVote(voter.address);
      
      await expect(ballotContract
        .connect(chairperson)
        .giveRightToVote(voter.address))
        .to.be.revertedWithoutReason();
    });
  });

  describe("when the voter interact with the vote function in the contract", async function () {
    
    it("should register the vote", async () => {
      const toVote = 0;
      const voteProposalBefore = await ballotContract.proposals(toVote);
      const voterAccount = accounts[1];

      await ballotContract
        .connect(chairperson)
        .giveRightToVote(voterAccount.address);
      
        
      await ballotContract
      .connect(voterAccount)
      .vote(toVote);
        
      const voteProposalAfter = await ballotContract.proposals(toVote);
      const voter = await ballotContract.voters(voterAccount.address);
      
      expect(voter.voted).to.be.eq(true);
      expect(voter.vote).to.be.eq(toVote);
      expect(voteProposalAfter.voteCount.sub(voteProposalBefore.voteCount))
        .to.be.eq(voter.weight);
    });
  });

  describe("when the voter interact with the delegate function in the contract", async function () {
    
    it("should transfer voting power", async () => {
      
      const voterAccount = accounts[1];
      const delegateAccount = accounts[2];

      await ballotContract
        .connect(chairperson)
        .giveRightToVote(voterAccount.address);

      await ballotContract
        .connect(chairperson)
        .giveRightToVote(delegateAccount.address);

      const delegateBefore = await ballotContract.voters(delegateAccount.address);

      await ballotContract
        .connect(voterAccount)
        .delegate(delegateAccount.address);

      const delegateAfter = await ballotContract.voters(delegateAccount.address);

      const voter = await ballotContract.voters(voterAccount.address);

      expect(voter.voted).to.be.eq(true);
      expect(voter.delegate).to.be.eq(delegateAccount.address);
      expect(delegateAfter.weight.sub(delegateBefore.weight)).to.be.eq(voter.weight);
    });
  });

  describe("when the an attacker interact with the giveRightToVote function in the contract", function () {
    it("should revert", async () => {
      await expect(ballotContract
        .connect(attacker)
        .giveRightToVote(accounts[1].address))
        .to.be.revertedWith("Only chairperson can give right to vote.");
    });
  });

  describe("when the an attacker interact with the vote function in the contract", function () {
    it("should revert", async () => {
      await expect(
        ballotContract
          .connect(attacker)
          .vote(0)
      ).to.be.revertedWith("Has no right to vote");
    });
  });

  describe("when the an attacker interact with the delegate function in the contract", function () {
    it("should revert", async () => {
      await expect(
        ballotContract
          .connect(attacker)
          .delegate(accounts[4].address)
      ).to.be.revertedWith("You have no right to vote");
    });
  });

  describe("when someone interact with the winningProposal function before any votes are cast", function () {
    it("should return 0", async () => {
      const winner = await ballotContract.winningProposal();
      expect(winner).to.be.eq(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the first proposal", function () {
    it("should return 0", async () => {
      const voterAccount = accounts[1];
      await vote(ballotContract, chairperson, voterAccount, 0);

      const winner = await ballotContract.winningProposal();
      expect(winner).to.be.eq(0);
    });
  });

  describe("when someone interact with the winningProposal function after one vote is cast for the second proposal", function () {
    it("should return 1", async () => {
      const voterAccount = accounts[1];
      await vote(ballotContract, chairperson, voterAccount, 1);

      const winner = await ballotContract.winningProposal();
      expect(winner).to.be.eq(1);
    });
  });

  describe("when someone interact with the winnerName function before any votes are cast", function () {
    it("should return name of proposal 0", async () => {
      const winner = await ballotContract.winnerName();
      expect(ethers.utils.parseBytes32String(winner)).to.be.eq("Proposal 1");
    });
  });

  describe("when someone interact with the winnerName function after one vote is cast for the first proposal", function () {
    it("should return name of proposal 0", async () => {
      const voterAccount = accounts[1];
      await vote(ballotContract, chairperson, voterAccount, 1);

      const winner = await ballotContract.winnerName();
      expect(ethers.utils.parseBytes32String(winner)).to.be.eq("Proposal 2");
    });
  });

  describe("when someone interact with the winningProposal function and winnerName after 5 random votes are cast for the proposals", function () {
    it("should return the name of the winner proposal", async () => {
      await vote(ballotContract, chairperson, accounts[1], 1);
      await vote(ballotContract, chairperson, accounts[2], 0);
      await vote(ballotContract, chairperson, accounts[4], 1);
      await vote(ballotContract, chairperson, accounts[5], 2);
      await vote(ballotContract, chairperson, accounts[6], 1);

      const winner = await ballotContract.winnerName();
      expect(ethers.utils.parseBytes32String(winner)).to.be.eq("Proposal 2");
    });
  });
});
