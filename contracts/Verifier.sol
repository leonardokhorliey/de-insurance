// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./USDTInterface.sol";


contract Verifier is Ownable {

    bool public verifierSignUpOpen;

    struct VerifierApplication {
        address user;
        string supportingDocsURI;
        uint status;
    }

    uint public verifierCount;

    VerifierApplication[] public verifierApplications;

    mapping (address => bool) public verifiers;
    mapping (address => bool) public blackListedVerifiers;

    USDTInterface public usdtContract;
    address public poolAddress;

    event VerifierEnrol(address user, string docsURI, uint contributionAmount);
    event ConfirmVerifierEnrol(address verifier);
    event DeclineVerfierEnrol(address verifier);
    event BlacklistVerifier(address verifier);

    constructor(address usdtAddress) {
        usdtContract = USDTInterface(usdtAddress);
    }

    function setPoolAddress(address _poolAddress) public onlyOwner {
        require(poolAddress == address(0), "Pool address already set");

        poolAddress = _poolAddress;
    }

    function registerAsVerifier(string memory profileDocURI, uint contributionAmount) public {
        require(enrolledAsVerifier(msg.sender) == -1, "Previously attempted enroll as verifier");

        usdtContract.transfer(poolAddress, contributionAmount);

        verifierApplications.push(VerifierApplication(msg.sender, profileDocURI, 0));
    }

    function isVerifier(address addr_) public view returns (bool) {
        return verifiers[addr_];    
    }

    function enrolledAsVerifier(address addr_) public view returns (int) {
        if (isVerifier(addr_)) return 1;
        for (uint i = 0; i < verifierApplications.length; i++) {
            if (verifierApplications[i].user == addr_) return int(verifierApplications[i].status);
        }

        return -1;
    }

    function approveVerifierRegistration(address potentialVerifier) public onlyOwner {
        int applicationIndex = enrolledAsVerifier(potentialVerifier);
        require(applicationIndex >= 0 && !isVerifier(potentialVerifier), "User already approved or never registered");

        verifiers[potentialVerifier] = true;
        verifierApplications[uint256(applicationIndex)].status = 1;
        verifierCount += 1;
        emit ConfirmVerifierEnrol(potentialVerifier);
    }

    function declineVerifierRegistration(address potentialVerifier) public onlyOwner {
        int applicationIndex = enrolledAsVerifier(potentialVerifier);
        require(enrolledAsVerifier(potentialVerifier) >= 0 && !isVerifier(potentialVerifier), "User already approved or never registered");

        verifierApplications[uint256(applicationIndex)].status = 2;
        verifierCount += 1;
        emit DeclineVerfierEnrol(potentialVerifier);
    }


    function blacklistVerifier(address _verifier) public onlyOwner {
        require(isVerifier(_verifier), "Not a verifier");
        int applicationIndex = enrolledAsVerifier(_verifier);

        verifiers[_verifier] = false;
        verifierApplications[uint256(applicationIndex)].status = 2;
        verifierCount -= 1;
        blackListedVerifiers[_verifier] = true;
        emit BlacklistVerifier(_verifier);
    }




}