// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Base64.sol";

contract Cranes is ERC721, ERC721Enumerable, Ownable {
  uint public constant MAX_CRANES = 16180;
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIdCounter;
  mapping (uint => Counters.Counter) private _yearlyCounts;
  mapping (uint => uint256) private _seeds;

  constructor() ERC721("Cranes", "CRNS") {}

  function mint() public onlyOwner {
    uint256 tokenId = _tokenIdCounter.current();
    _safeMint(_msgSender(), tokenId);
    _seeds[tokenId] = _random(_toString(block.timestamp));
    _tokenIdCounter.increment();
    _yearlyCounts[_getCurrentYear()].increment();
  }

  function craft() public virtual payable {

  }

  function _getCurrentYear() private view returns (uint) {
    return 1970 + block.timestamp / 31556926;
  }

  function totalYearlySupply() public view returns (uint256) {
    return _yearlyCounts[_getCurrentYear()].current();
  }

  function tokenURI(uint256 tokenId) override public view returns (string memory) {
    uint seed = _seeds[tokenId] + tokenId;
    string memory color0 = _randomRGB(seed, "COLOR0");
    string memory color1 = _randomRGB(seed, "COLOR1");
    string memory background = _randomRGB(seed, "BACKGROUND");

    string[43] memory parts;
    parts[0] = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048" xmlns:v="https://vecta.io/nano"><defs><filter id="S" x="0" y="0"><feGaussianBlur in="SourceGraphic" stdDeviation="50"/></filter><linearGradient x1="17%" y1="81%" x2="87%" y2="21.5%" id="A"><stop stop-color="';
    parts[1] = color0;
    parts[2] = '" offset="0%"/><stop stop-color="';
    parts[3] = color1;
    parts[4] = '" offset="100%"/></linearGradient><linearGradient x1="50%" y1="92.0%" x2="61.2%" y2="79.9%" id="B"><stop stop-color="';
    parts[5] = color0;
    parts[6] = '" offset="0%"/><stop stop-color="';
    parts[7] = color1;
    parts[8] = '" offset="100%"/></linearGradient><linearGradient x1="45.3%" y1="50%" x2="57.3%" y2="89.5%" id="C"><stop stop-color="';
    parts[9] = color0;
    parts[10] = '" offset="0%"/><stop stop-color="';
    parts[11] = color1;
    parts[12] = '" offset="100%"/></linearGradient><linearGradient x1="71.9%" y1="19.3%" x2="29.1%" y2="100%" id="D"><stop stop-color="';
    parts[13] = color0;
    parts[14] = '" offset="0%"/><stop stop-color="';
    parts[15] = color1;
    parts[16] = '" offset="100%"/></linearGradient><linearGradient x1="36.3%" y1="44.3%" x2="59.0%" y2="25.9%" id="E"><stop stop-color="';
    parts[17] = color0;
    parts[18] = '" offset="0%"/><stop stop-color="';
    parts[19] = color1;
    parts[20] = '" offset="100%"/></linearGradient><linearGradient x1="-17.9%" y1="79.6%" x2="57.4%" y2="11.3%" id="F"><stop stop-color="';
    parts[21] = color0;
    parts[22] = '" offset="0%"/><stop stop-color="';
    parts[23] = color1;
    parts[24] = '" offset="100%"/></linearGradient><linearGradient x1="60.7%" y1="12.1%" x2="42.1%" y2="106.3%" id="G"><stop stop-color="';
    parts[25] = color0;
    parts[26] = '" offset="0%"/><stop stop-color="';
    parts[27] = color1;
    parts[28] = '" offset="100%"/></linearGradient><linearGradient x1="43.7%" y1="57.6%" x2="75.1%" y2="8.1%" id="H"><stop stop-color="';
    parts[29] = color0;
    parts[30] = '" offset="0%"/><stop stop-color="';
    parts[31] = color1;
    parts[32] = '" offset="100%"/></linearGradient><linearGradient x1="100%" y1="42.2%" x2="50%" y2="58.4%" id="I"><stop stop-color="';
    parts[33] = color0;
    parts[34] = '" offset="0%"/><stop stop-color="';
    parts[35] = color1;
    parts[36] = '" offset="100%"/></linearGradient></defs><g fill="none" fill-rule="evenodd"><path fill="';
    parts[37] = background;
    parts[38] = '" d="M0 0h2048v2048H0z"/><polygon filter="url(#S)" fill="rgba(0,0,0,.3)" points="271 562 783 1247 1005 999 1930 643 1637 1256 1871 1510 1607 1355 1149 1775 1047 1641 55 1434 576 1195"></polygon><g><animateTransform attributeName="transform" type="translate" values="82 186;82 140;82 186" dur="4s" repeatCount="indefinite" /><path fill="url(#A)" d="M833 785l115-264 936-425-335 796-317 189z"/><path fill="url(#B)" d="M572 851L219 0l576 932z"/><path fill="url(#C)" d="M994 706l238 330-144 88z"/><path fill="url(#D)" d="M1165 1398l405-466.286L1521.949 870z"/><path d="M1550 834c20.633-11.828 63.814.701 88 30 16.124 19.533 72.457 108.199 169 266l-285-269c4.911-10.115 14.245-19.115 28-27z" fill="url(#E)"/><path d="M1063 1109l400-264c19-13 52-25 84-7 21.333 12 108 109.333 260 292l-279-216-363 484-68 41-34-330z" fill="url(#F)"/><path fill="url(#G)" d="M1097 1439l47-206-150 33z"/><path fill="url(#H)" d="M651 857l343-151 150 527z"/><path fill="url(#I)" d="M0 1035l498-267 213 62 433 403-113 52z"/></g><path fill="';
    parts[39] = color1;
    parts[40] = '" d="M0 1968h80v80H0z"/><path fill="';
    parts[41] = color0;
    parts[42] = '" d="M80 1968h80v80H80z"/></g></svg>';

    string memory output = string(abi.encodePacked(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5], parts[6], parts[7], parts[8], parts[9], parts[10]));
    output = string(abi.encodePacked(output, parts[11], parts[12], parts[13], parts[14], parts[15], parts[16], parts[17], parts[18], parts[19], parts[20]));
    output = string(abi.encodePacked(output, parts[21], parts[22], parts[23], parts[24], parts[25], parts[26], parts[27], parts[28], parts[29], parts[30]));
    output = string(abi.encodePacked(output, parts[31], parts[32], parts[33], parts[34], parts[35], parts[36], parts[37], parts[38], parts[39], parts[40]));
    output = string(abi.encodePacked(output, parts[41], parts[42]));

    output = Base64.encode(bytes(string(abi.encodePacked('{"name": "Crane #', _toString(tokenId), '", "description": "Cranes are little on-chain tokens of luck for special wallets", "image": "data:image/svg+xml;base64,', Base64.encode(bytes(output)), '"}'))));

    output = string(abi.encodePacked('data:application/json;base64,', output));

    return output;
  }

  function _randomRGB(uint256 tokenId, string memory key) internal pure returns (string memory) {
    return string(abi.encodePacked(
      "rgb(",
      _randomHEX(tokenId, key, 0), ",",
      _randomHEX(tokenId, key, 1), ",",
      _randomHEX(tokenId, key, 2), ")"
    ));
  }

  function _randomHEX(uint256 tokenId, string memory key, uint i) internal pure returns (string memory) {
    uint256 rand = _random(string(abi.encodePacked(key, _toString(i), _toString(tokenId))));
    return _toString(rand % 255);
  }

  function _random(string memory input) internal pure returns (uint256) {
    return uint256(keccak256(abi.encodePacked(input)));
  }

  function _toString(uint256 value) internal pure returns (string memory) {
    // Inspired by OraclizeAPI's implementation - MIT license
    // https://github.com/oraclize/ethereum-api/blob/b42146b063c7d6ee1358846c198246239e9360e8/oraclizeAPI_0.4.25.sol

    if (value == 0) { return "0"; }
    uint256 temp = value;
    uint256 digits;
    while (temp != 0) {
      digits++;
      temp /= 10;
    }
    bytes memory buffer = new bytes(digits);
    while (value != 0) {
      digits -= 1;
      buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
      value /= 10;
    }
    return string(buffer);
  }

  // The following functions are overrides required by Solidity.

  function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721, ERC721Enumerable) {
    super._beforeTokenTransfer(from, to, tokenId);
  }

  function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721Enumerable) returns (bool) {
    return super.supportsInterface(interfaceId);
  }
}
