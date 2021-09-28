const fs = require("fs");
const { cwd } = require("process");
const { expect } = require("chai");
const { beforeEach } = require("mocha");

describe("CraneSpecials2021", function () {
  let special1Contract;
  let cranesContract;
  let contract;
  let owner;
  let wallet1;
  let wallet2;

  beforeEach(async function () {
    const ColorsContract = await hre.ethers.getContractFactory("Colors");
    const colors = await ColorsContract.deploy();
    const CranesContract = await hre.ethers.getContractFactory("Cranes", {
      libraries: { Colors: colors.address },
    });
    cranesContract = await CranesContract.deploy();
    [owner, wallet1, wallet2] = await hre.ethers.getSigners();

    const SpecialCraneContract = await hre.ethers.getContractFactory(
      "CraneSpecials2021"
    );
    contract = await SpecialCraneContract.deploy(cranesContract.address);

    special1Contract = await (
      await hre.ethers.getContractFactory("Special_2021_1")
    ).deploy();
    contract.setReleaseAddress(0, special1Contract.address);
  });

  it("has a reference to cranes contract", async function () {
    expect(await contract.cranesAddress()).to.equal(cranesContract.address);
  });

  it("has a tokenUri", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });
    await contractAsWallet.craftWithCrane(0);

    const i = 0;
    const uri = await contract.uri(i);
    expect(uri).to.match(/^data:/);

    const [pre, base64] = uri.split(",");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
    expect(json["image"]).to.match(/^data:image\/svg/);

    const svg = Buffer.from(json["image"].split(",")[1], "base64").toString(
      "utf-8"
    );
    fs.writeFileSync(`./tmp/special1-${i}.svg`, svg);
    console.log(cwd() + `/tmp/special1-${i}.svg`);
  });

  it("can mint if Crane in wallet", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await contractAsWallet.craftWithCrane(0);
    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(1);
  });

  it("can mint once for all Cranes in wallet", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await contractAsWallet.craftWithCrane(0);
    await contractAsWallet.craftWithCrane(0);
    await contractAsWallet.craftWithCrane(0);

    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(3);
  });

  it("cannot mint twice with same crane", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await contractAsWallet.craftWithCrane(0);

    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(1);

    await expect(contractAsWallet.craftWithCrane(0)).to.be.revertedWith(
      "This special has already been minted for all your cranes"
    );
  });

  it("cannot mint without cranes", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    await cranesContract.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(0);

    await expect(contractAsWallet.craftWithCrane(0)).to.be.revertedWith(
      "Wallet doesn't hold a crane"
    );
  });

  it("cannot mint unreleased specials", async function () {
    await cranesContract.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await expect(contract.craftWithCrane(1)).to.be.revertedWith(
      "Special not yet released"
    );

    await contract.setReleaseAddress(1, special1Contract.address);

    await expect(contract.craftWithCrane(1)).to.not.be.revertedWith(
      "Special not yet released"
    );
  });

  it("can get release address", async function () {
    let released, addr;

    [released, addr] = await contract.getReleaseAddress(0);

    expect(released).to.eq(true);

    expect(addr).to.match(/0x\w+/);

    [released, addr] = await contract.getReleaseAddress(1);

    expect(released).to.eq(false);
    expect(addr).to.match(/0x(0){20}/);
  });
});
