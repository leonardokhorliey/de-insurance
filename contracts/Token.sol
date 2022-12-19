// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DeInsureToken is ERC1155, Ownable {

    // defines the premium percent to be paid 
    struct PackageType {
        uint tokenId;
        uint premiumPercentage;
    }

    mapping (uint => string) public tokenURIs;
    uint private tokenCounter;

    PackageType[] public tokenTypes;
    address public poolAddress;

    enum InsuranceValuationType {
        USER_VALUED,
        COMPANY_VALUED
    }

    // maps user to claims beyond contributions based on tokenType
    mapping (address => mapping(uint => uint)) public exceedingAmounts;

    constructor() ERC1155("") {
        tokenCounter = 0;
    }

    function uri(uint256 tokenId) public view virtual override returns (string memory) {
        return tokenURIs[tokenId];
    }


    // defines the monthly premium percentage as a 4-digit number (fraction * 10000)
    function createNewPackage(uint _premiumPercentage, string memory tokenURI) public onlyOwner {
        
        uint _tokenCode = tokenCounter + 1;

        require(abi.encodePacked(tokenURIs[_tokenCode]).length == 0, "Already set URI for this package");
        tokenURIs[_tokenCode] = tokenURI;
        _mint(msg.sender, _tokenCode, 1, "");

        tokenTypes.push(PackageType(_tokenCode, _premiumPercentage));

        tokenCounter = _tokenCode;
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

    function getPackages() external view returns (PackageType[] memory) {
        
        return tokenTypes;
    }

    function setPoolAddress(address _addr) public onlyOwner {
        require(poolAddress == address(0), "Pool address already set");
        poolAddress = _addr;
    }

    function mintToClient(address client, uint _tokenId, uint _amount) public {
        require(msg.sender == poolAddress, "Not authorized to call this function");

        _mint(client, _tokenId, _amount, "");
    }

    function burnFromClient(address client, uint _tokenId, uint _amount) public {
        require(msg.sender == poolAddress, "Not authorized to call this function");
        uint balanceOfToken = balanceOf(client, _tokenId);
        if (balanceOfToken < _amount) {
            _burn(client, _tokenId, balanceOfToken);
            exceedingAmounts[client][_tokenId] += (_amount - balanceOfToken);
            return;
        }

        _burn(client, _tokenId, _amount);
    }



    
}