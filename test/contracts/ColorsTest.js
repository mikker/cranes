const { expect } = require("chai");

describe("Colors", function () {
  let contract;

  beforeEach(async function () {
    const Colors = await hre.ethers.getContractFactory("Colors");
    contract = await Colors.deploy();
    await contract.deployed();
  });

  it("generates random colors", async function () {
    const color = await contract.fromSeed("woop woop")
    expect(typeof color.red.toNumber()).to.eq('number')
    expect(typeof color.green.toNumber()).to.eq('number')
    expect(typeof color.blue.toNumber()).to.eq('number')
    // Somehow calling a library with a struct fails
    // See https://ethereum.stackexchange.com/questions/83669/unit-testing-a-solidity-library-function-with-a-struct-memory-argument#comment104224_83669
    // const rgb = await contract.toCSSString(color)
    // console.log(rgb)
  });
})
