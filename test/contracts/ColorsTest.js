const { expect } = require("chai");

describe("Colors", function () {
  let contract;

  beforeEach(async function () {
    const Colors = await hre.ethers.getContractFactory("Colors");
    contract = await Colors.deploy();
    await contract.deployed();
  });
});
