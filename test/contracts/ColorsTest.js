const { expect } = require("chai");

describe("Colors", function () {
  let contract;

  beforeEach(async function () {
    const Colors = await hre.ethers.getContractFactory("Colors");
    contract = await Colors.deploy();
    await contract.deployed();
  });

  it("calculates brightness", async function () {
    const distBlack = await contract.brightness(0, 0, 0)
    expect(distBlack.toNumber()).to.eq(0)
    const distWhite = await contract.brightness(255, 255, 255)
    expect(distWhite.toNumber()).to.eq(255)
  });

  // it("calculates contrasts", async function () {
  //   const c1 = await contract.fromSeed("woop woop");
  //   const c2 = await contract.fromSeed("woop woop");
  //   const dist = await contract.contrastTo(c1, c2)
  // });

  it("generates random colors", async function () {
    const color = await contract.fromSeed("woop woop");
    expect(typeof color.hue.toNumber()).to.eq("number");
    expect(typeof color.saturation.toNumber()).to.eq("number");
    expect(typeof color.lightness.toNumber()).to.eq("number");
    // Somehow calling a library with a struct fails
    // See https://ethereum.stackexchange.com/questions/83669/unit-testing-a-solidity-library-function-with-a-struct-memory-argument#comment104224_83669
    // const rgb = await contract.toCSSString(color)
    // console.log(rgb)
  });
});
