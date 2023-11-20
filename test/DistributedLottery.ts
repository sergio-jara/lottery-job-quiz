import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Distributed Lottery", function () {
  async function deployOneYearLockFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2, account3] = await ethers.getSigners();

    const TRIF = await ethers.getContractFactory("tRIF");
    const tRIF = await (
      await TRIF.deploy(
        owner.address,
        ethers.utils.parseEther("100000000000000"),
        "TRIF",
        "TRIF"
      )
    ).deployed();

    await (
      await tRIF.transfer(account1.address, ethers.utils.parseEther("1000"))
    ).wait();

    await (
      await tRIF.transfer(account2.address, ethers.utils.parseEther("1000"))
    ).wait();

    await (
      await tRIF.transfer(account3.address, ethers.utils.parseEther("1000"))
    ).wait();

    const DistributedLottery = await ethers.getContractFactory(
      "DistributedLottery"
    );

    const distributedLottery = await (
      await DistributedLottery.deploy(tRIF.address)
    ).deployed();

    return { distributedLottery, tRIF, owner, account1, account2, account3 };
  }

  //this test is supposed to executed the whole workflow. start the lottery,
  // allow a few accounts to enter, pick a winner and award the funds to the winner
  describe("Enter and Pick winners", function () {
    it("Should successfully run end to end ", async function () {
      const { distributedLottery, tRIF, owner, account1, account2, account3 } =
        await loadFixture(deployOneYearLockFixture);

        await(await tRIF.connect(account1).approve(distributedLottery.address, ethers.utils.parseEther("4"))).wait();
        await(await tRIF.connect(account2).approve(distributedLottery.address, ethers.utils.parseEther("4"))).wait();
        await(await tRIF.connect(account3).approve(distributedLottery.address, ethers.utils.parseEther("4"))).wait();

        await(await distributedLottery.connect(owner).startLoterry()).wait();
        await distributedLottery.connect(account1).enter();
        await distributedLottery.connect(account2).enter();
        await distributedLottery.connect(account3).enter();
        await(await distributedLottery.connect(owner).endLottery()).wait();

        console.log('acc1 balance:', await tRIF.balanceOf(account1.address));
        console.log('acc2 balance:', await tRIF.balanceOf(account2.address));
        console.log('acc3 balance:', await tRIF.balanceOf(account3.address));
    });

  });

});
