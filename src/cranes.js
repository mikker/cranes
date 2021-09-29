export const address = "0xc3F5E8A98B3d97f19938E4673Fd97C7cfd155577"; // mainnet
// export const address = "0x852900dCda9846a28486b641e5520Abf3cABc775"; // rinkeby

export const abi = [
  {
    inputs: [
      {
        internalType: "address",
        name: "walletAddress",
        type: "address",
      },
    ],
    name: "craftForFriend",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "craftForSelf",
    outputs: [],
    type: "function",
  },
  {
    inputs: [],
    name: "currentYearTotalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    type: "function",
  },
];
