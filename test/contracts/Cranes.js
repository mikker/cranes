const fs = require('fs')
const { cwd } = require('process')
const { expect } = require("chai");
const { beforeEach } = require("mocha");

describe("Cranes", function () {
  let contract;
  let owner;
  let wallet1;

  beforeEach(async function () {
    const CranesContract = await hre.ethers.getContractFactory("Cranes");
    [owner, wallet1] = await hre.ethers.getSigners();
    contract = await CranesContract.deploy();
    await contract.deployed();
  });

  it("has name and symbol", async function () {
    expect(await contract.name()).to.equal("Cranes");
    expect(await contract.symbol()).to.equal("CRNS");
  });

  it("has a grand total and a yearly total", async function () {
    expect(await contract.totalSupply()).to.equal(0);
    expect(await contract.totalYearlySupply()).to.equal(0);
    await contract.mint()
    expect(await contract.totalSupply()).to.equal(1);
    expect(await contract.totalYearlySupply()).to.equal(1);
  })

  it("can be minted by owner", async function () {
    const token = await contract.mint()
    const balance = await contract.balanceOf(owner.address)
    expect(balance).to.equal(1)
  });

  it("has a tokenUri", async function () {
    const token = await contract.mint()
    const uri = await contract.tokenURI(0)
    expect(uri).to.match(/^data:/)

    const [pre, base64] = uri.split(',')
    const json = JSON.parse(Buffer.from(base64, 'base64').toString('utf-8'))
    expect(json["image"]).to.match(/^data:image\/svg/)

    const svg = Buffer.from(json["image"].split(',')[1], 'base64').toString('utf-8')
    fs.writeFileSync('./tmp/last.svg', svg)
    console.log(cwd() + '/tmp/last.svg')
  })
});
