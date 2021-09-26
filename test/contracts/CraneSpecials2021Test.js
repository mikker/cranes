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
    await contractAsWallet.mintWithCrane(0, 0);

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

  it("can mint with craneId if owned", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await contractAsWallet.mintWithCrane(0, 0);
    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(1);
  });

  it("cannot mint twice with craneId", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    const cranesContractAsWallet = await cranesContract.connect(wallet1);
    const crane = await cranesContractAsWallet.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    // first time
    await contractAsWallet.mintWithCrane(0, 0);

    await expect(contractAsWallet.mintWithCrane(0, 0)).to.be.revertedWith(
      "Special already minted for craneId"
    );
  });

  it("cannot mint other people's cranes", async function () {
    const contractAsWallet = await contract.connect(wallet1);
    await cranesContract.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    expect(await contract.balanceOf(wallet1.address, 0)).to.equal(0);

    await expect(contractAsWallet.mintWithCrane(0, 0)).to.be.revertedWith(
      "Wallet doesn't own this crane"
    );
  });

  it("cannot mint unreleased specials", async function () {
    await cranesContract.craftForSelf({
      value: ethers.utils.parseEther("0.02"),
    });

    await expect(contract.mintWithCrane(1, 0)).to.be.revertedWith(
      "Special not yet released"
    );

    await contract.setReleaseAddress(1, special1Contract.address);

    await expect(contract.mintWithCrane(1, 0)).to.not.be.revertedWith(
      "Special not yet released"
    );
  });

  it("can get release address", async function () {
    let released, addr;

    [released, addr] = await contract.getReleaseAddress(0);
    expect(released).to.eq(true);
    expect(addr).to.match(/0x\w+/)

    [released, addr] = await contract.getReleaseAddress(1);
    expect(released).to.eq(false);
    expect(addr).to.match(/0x(0){20}/)
  })

  // it("has a grand total and a yearly total", async function () {
  //   expect(await contract.totalSupply()).to.equal(0);
  //   expect(await contract.currentYearTotalSupply()).to.equal(0);
  //   await contract.mint(owner.address);
  //   expect(await contract.totalSupply()).to.equal(1);
  //   expect(await contract.currentYearTotalSupply()).to.equal(1);
  // });

  // it("can be minted by owner", async function () {
  //   await contract.mint(owner.address);
  //   expect(await contract.balanceOf(owner.address)).to.equal(1);
  // });

  // it("can be crafted by anyone for themselves", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   await contractAsWallet.craftForSelf({
  //     value: ethers.utils.parseEther("0.02"),
  //   });
  //   expect(await contract.balanceOf(owner.address)).to.equal(0);
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(1);
  // });

  // it("throws when price is too low", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   expect(
  //     contractAsWallet.craftForSelf({
  //       value: ethers.utils.parseEther("0.0002"),
  //     })
  //   ).to.be.revertedWith("PRICE_NOT_MET");

  //   expect(
  //     contractAsWallet.craftForFriend(wallet2.address, {
  //       value: ethers.utils.parseEther("0.0002"),
  //     })
  //   ).to.be.revertedWith("PRICE_NOT_MET");
  // });

  // it("can be crafted by anyone for someone else", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   const token = await contractAsWallet.craftForFriend(wallet2.address, {
  //     value: ethers.utils.parseEther("0.02"),
  //   });
  //   expect(await contract.balanceOf(owner.address)).to.equal(0);
  //   expect(await contract.balanceOf(wallet1.address)).to.equal(0);
  //   expect(await contract.balanceOf(wallet2.address)).to.equal(1);
  // });

  // it("has a tokenUri", async function () {
  //   const i = 0;
  //   const token = await contract.mint(owner.address);
  //   const uri = await contract.tokenURI(i);
  //   expect(uri).to.match(/^data:/);

  //   const [pre, base64] = uri.split(",");
  //   const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));
  //   expect(json["image"]).to.match(/^data:image\/svg/);

  //   const svg = Buffer.from(json["image"].split(",")[1], "base64").toString(
  //     "utf-8"
  //   );
  //   fs.writeFileSync(`./tmp/last-${i}.svg`, svg);
  //   console.log(cwd() + `/tmp/last-${i}.svg`);
  // });

  // it("can update its price", async function () {
  //   const contractAsWallet = await contract.connect(wallet1);
  //   await contractAsWallet.craftForSelf({
  //     value: ethers.utils.parseEther("0.02"),
  //   });

  //   contract.setPrice(ethers.utils.parseEther("0.1"));

  //   expect(
  //     contractAsWallet.craftForSelf({
  //       value: ethers.utils.parseEther("0.002"),
  //     })
  //   ).to.be.revertedWith("PRICE_NOT_MET");
  // });
});
