const fs = require("fs");
const cranesAddress = "0xc3F5E8A98B3d97f19938E4673Fd97C7cfd155577";
const colorsAddress = "0x41ef170c05512e3ec89c097215c03091a4dfc095";

async function main() {
  const Cranes = await ethers.getContractFactory("Cranes", {
    libraries: { Colors: colorsAddress },
  });
  const contract = Cranes.attach(cranesAddress)

  // console.log(contract);

  const ids = Array.from({ length: 1001 }, (_, i) => i);
  await Promise.all(
    ids.map(
      (i) =>
        contract.tokenURI(i).then((uri) => {
          console.log(i);
          const [_pre, base64] = uri.split(",");
          const json = JSON.parse(
            Buffer.from(base64, "base64").toString("utf-8")
          );
          const svg = Buffer
            .from(json["image"].split(",")[1], "base64")
            .toString("utf-8");
          fs.writeFileSync(`./dump/${i}.svg`, svg);
          console.log(i)
        }),
      (err) => console.error(err)
    )
  );
  console.log("Done");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
