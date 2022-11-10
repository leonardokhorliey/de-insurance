// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeInsureToken is ERC1155, Ownable {

    // defines the premium percent to be paid 
    struct PackageType {
        uint tokenId;
        uint premiumPercentage;
    }

    PackageType[] public tokenTypes;

    enum InsuranceValuationType {
        USER_VALUED,
        COMPANY_VALUED
    }

    constructor(string memory ipfsDirectory) ERC1155(string(abi.encodePacked(ipfsDirectory, "{id}.sol"))) {
        tokenTypes = [];
    }


    // defines the monthly premium percentage as a 4-digit number (fraction * 10000)
    function createNewToken(uint _tokenCode, uint _premiumPercentage) public onlyOwner {
        _mint(msg.sender, _tokenCode, 1, "");

        tokenTypes.push(PackageType(_tokenCode, _premiumPercentage));
    }

    function isTokenType(uint _tokenType) public view returns (bool) {
        for (uint i = 0; i < tokenTypes.length; i++) {
            if (tokenTypes[i].tokenId == _tokenType) return true;
        }

        return false;
    }

    function getPackageType(uint _tokenType) public view returns (PackageType memory) {
        PackageType memory pkg;
        for (uint i = 0; i < tokenTypes.length; i++) {
            if (tokenTypes[i].tokenId == _tokenType) pkg = tokenTypes[i];
        }

        return pkg;
    }

    
}