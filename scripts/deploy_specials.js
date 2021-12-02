async function main() {
  // const cranesAddress =
  //   process.env.CRANES_ADDR || "0x852900dCda9846a28486b641e5520Abf3cABc775"; // Cranes on Rinkeby

  // const Special2Factory = await ethers.getContractFactory("Special_2021_2");
  // const special2 = await Special2Factory.deploy();
  // console.log("Special2 deployed to:", special2.address);

  const Special3Factory = await ethers.getContractFactory("Special_2021_3");
  const special3 = await Special3Factory.deploy();
  console.log("Special3 deployed to:", special3.address);

  // const SpecialsFactory = await ethers.getContractFactory("CraneSpecials2021");
  // const specials = await SpecialsFactory.deploy(cranesAddress);
  // console.log("Specials deployed to:", specials.address);

  // specials.setReleaseAddress(0, special1.address);
  // console.log("First release address set");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
