// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "./Base64.sol";
import "./SpecialInterface.sol";

interface CranesInterface {
  function ownerOf(uint256 tokenId) external view returns (address owner);
}

contract CraneSpecials2021 is ERC1155, Ownable {
  using EnumerableSet for EnumerableSet.UintSet;
  using EnumerableMap for EnumerableMap.UintToAddressMap;

  string constant DESCRIPTION = "A special token for special cranes in special wallets.";

  EnumerableMap.UintToAddressMap private releasedSpecials;
  mapping(uint256 => EnumerableSet.UintSet) private minted;

  address public cranesAddress;
  CranesInterface cranesContract;

  constructor(address _cranesAddres) ERC1155("N/A") {
    cranesAddress = _cranesAddres;
    cranesContract = CranesInterface(cranesAddress);
  }

  function setReleaseAddress(uint256 id, address _address) public onlyOwner {
    releasedSpecials.set(id, _address);
  }

  function getReleaseAddress(uint id) public view returns (bool, address) {
    return releasedSpecials.tryGet(id);
  }

  function mintWithCrane(uint id, uint256 craneId) public virtual {
    require(!minted[id].contains(craneId), "Special already minted for craneId");
    require(cranesContract.ownerOf(craneId) == msg.sender, "Wallet doesn't own this crane");
    require(releasedSpecials.contains(id), "Special not yet released");

    mint(msg.sender, id, craneId, 1);
  }

  function mint(
    address dest,
    uint256 id,
    uint256 craneId,
    uint256 amount
  ) public virtual {
    minted[id].add(craneId);
    _mint(dest, id, amount, "");
  }

  function uri(uint256 id) public view virtual override returns (string memory) {
    require(releasedSpecials.contains(id), "Special not yet released");

    SpecialInterface special = SpecialInterface(releasedSpecials.get(id));
    string memory image64 = special.getImageBase64();

    string memory base64 = Base64.encode(bytes(string(abi.encodePacked('{"name":"Cranes #2021/Special-1","description":"', DESCRIPTION, '","image":"data:image/svg+xml;base64,', image64, '"}'))));
    return string(abi.encodePacked("data:application/json;base64,", base64));
  }
}
