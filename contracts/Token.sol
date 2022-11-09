// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeInsureToken is ERC1155, Ownable {

    uint[] public tokenTypes;

    enum InsuranceValuationType {
        USER_VALUED,
        COMPANY_VALUED
    }

    constructor(string memory ipfsDirectory) ERC1155(string(abi.encodePacked(ipfsDirectory, "{id}.sol"))) {
        tokenTypes = [];
    }

    function createNewToken(uint memory tokenCode) public onlyOwner {
        _mint(msg.sender, tokenCode, 1, "");

        tokenTypes.push(tokenCode);
    }

    function isTokenType(uint _tokenType) public view returns (bool) {
        for (uint i = 0; i < tokenTypes.length; i++) {
            if (tokenTypes[i] == _tokenType) return true;
        }

        return false;
    }

    
}