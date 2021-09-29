// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableMap.sol";
import "./Base64.sol";
import "./SpecialInterface.sol";

interface CranesInterface is IERC721, IERC721Enumerable {}

contract CraneSpecials2021 is ERC1155, Ownable {
  using Strings for uint256;
  using EnumerableSet for EnumerableSet.UintSet;
  using EnumerableMap for EnumerableMap.UintToAddressMap;

  string constant DESCRIPTION = "A special token for special cranes in special wallets.";

  EnumerableMap.UintToAddressMap private releasedSpecials;
  mapping(uint256 => EnumerableSet.UintSet) private minted;

  address public cranesAddress;
  CranesInterface cranesContract;

  constructor(address _cranesAddres) ERC1155("") {
    cranesAddress = _cranesAddres;
    cranesContract = CranesInterface(cranesAddress);
  }

  function setReleaseAddress(uint256 id, address _address) public onlyOwner {
    releasedSpecials.set(id, _address);
  }

  function getReleaseAddress(uint256 id) public view returns (bool, address) {
    return releasedSpecials.tryGet(id);
  }

  function craftWithCrane(uint256 specialNumber) public virtual {
    require(releasedSpecials.contains(specialNumber), "Special not yet released");

    uint256 balance = cranesContract.balanceOf(msg.sender);
    require(balance > 0, "Wallet doesn't hold a crane");

    uint256 unmintedCraneId = 9999; // not found
    uint256 token;
    for (uint256 i = 0; i < balance; i++) {
      token = cranesContract.tokenOfOwnerByIndex(msg.sender, i);
      if (minted[specialNumber].contains(token)) continue;
      unmintedCraneId = token;
    }

    require(unmintedCraneId != 9999, "This special has already been minted for all your cranes");

    minted[specialNumber].add(unmintedCraneId);

    _mint(msg.sender, specialNumber, 1, "");
  }

  function uri(uint256 id) public view virtual override returns (string memory) {
    require(releasedSpecials.contains(id), "Special not yet released");

    SpecialInterface special = SpecialInterface(releasedSpecials.get(id));
    string memory imageUri = special.getURI();

    string memory base64 = Base64.encode(bytes(string(abi.encodePacked('{"name":"Cranes #2021/Special ', (id + 1).toString(), '","description":"', DESCRIPTION, '","image":"', imageUri, '"}'))));
    return string(abi.encodePacked("data:application/json;base64,", base64));
  }
}
