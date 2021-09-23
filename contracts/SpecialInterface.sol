// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

interface SpecialInterface {
  function getImageBase64(uint256 id, uint256 craneId) external pure returns (string memory);
}

