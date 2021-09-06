// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/utils/Strings.sol";

library Colors {
  using Strings for uint256;

  struct Color {
    uint256 red;
    uint256 green;
    uint256 blue;
  }

  function fromSeed(string memory seed) public pure returns (Color memory) {
    return
      Color(
        valueFromSeed(string(abi.encodePacked("R", seed))),
        valueFromSeed(string(abi.encodePacked("G", seed))),
        valueFromSeed(string(abi.encodePacked("B", seed)))
      );
  }

  function toCSSString(Color memory color) public pure returns (string memory) {
    return
      string(
        abi.encodePacked(
          "rgb(",
          color.red.toString(),
          ",",
          color.green.toString(),
          ",",
          color.blue.toString(),
          ")"
        )
      );
  }

  function valueFromSeed(string memory seed) private pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(seed))) % 255;
  }
}
