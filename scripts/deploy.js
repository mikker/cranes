async function main() {
  // We get the contract to deploy
  const Colors = await ethers.getContractFactory("Colors");
  const colors = await Colors.deploy();

  const Cranes = await ethers.getContractFactory("Cranes", {
    libraries: { Colors: colors.address },
  });
  const cranes = await Cranes.deploy();

  console.log("Cranes deployed to:", cranes.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
