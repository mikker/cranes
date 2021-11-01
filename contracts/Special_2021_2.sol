// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./SpecialInterface.sol";

contract Special_2021_2 is SpecialInterface {
  function getURI() override  external pure returns (string memory) {
    return "ipfs://QmbiivmtLA96C5r2tbZ3UTgopeiemDQQactY4iSGv1AXqG";
  }
}
