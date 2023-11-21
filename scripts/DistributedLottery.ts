import { ethers } from "hardhat";

async function main() {
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
    await DistributedLottery.deploy()
  ).deployed();

  // your code starts here

  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
