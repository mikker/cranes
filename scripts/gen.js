const fs = require("fs");
const { cwd } = require("process");

async function main() {
  // We get the contract to deploy
  const Colors = await ethers.getContractFactory("Colors");
  const colors = await Colors.deploy();

  const Cranes = await ethers.getContractFactory("Cranes", {
    libraries: { Colors: colors.address },
  });
  const contract = await Cranes.deploy();

  const signers = await hre.ethers.getSigners();

  for (let i = 0; i <= 100; i++) {
    const dest = signers[Math.floor(Math.random() * signers.length)];
    const token = await contract.mint(dest.address);
    const uri = await contract.tokenURI(i);

    const [pre, base64] = uri.split(",");
    const json = JSON.parse(Buffer.from(base64, "base64").toString("utf-8"));

    const svg = Buffer.from(json["image"].split(",")[1], "base64").toString(
      "utf-8"
    );
    fs.writeFileSync(`./tmp/last-${i}.svg`, svg);
    console.log(cwd() + `/tmp/last-${i}.svg`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
