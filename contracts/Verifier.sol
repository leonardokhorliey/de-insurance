// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./USDTInterface.sol";
import "./InsurancePool.sol";

contract Verifier is Ownable {

    bool public verifierSignUpOpen;

    struct VerifierApplication {
        address user;
        string supportingDocsURI;
        uint256 contributionAmount;
        uint status;
        address creator;
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
        verifierSignUpOpen= true;
    }

    function setPoolAddress(address _poolAddress) public onlyOwner {
        require(poolAddress == address(0), "Pool address already set");

        poolAddress = _poolAddress;
    }

    function registerAsVerifier(string memory profileDocURI, uint contributionAmount) public {
        require(verifierSignUpOpen, "Unauthorized at this time");
        require(enrolledAsVerifier(msg.sender) == -1, "Previously attempted enroll as verifier");

        usdtContract.transfer(poolAddress, contributionAmount);

        verifierApplications.push(VerifierApplication(msg.sender, profileDocURI, contributionAmount, 0, msg.sender));
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
        verifierApplications[uint256(applicationIndex)].status = 3;
        verifierCount -= 1;
        blackListedVerifiers[_verifier] = true;
        emit BlacklistVerifier(_verifier);
    }

    function closeVerifierSignUpPeriod() public onlyOwner {
        require(verifierSignUpOpen, "Already closed");
        verifierSignUpOpen = false;
    }

    function openVerifierSignUpPeriod() public onlyOwner {
        require(!verifierSignUpOpen, "Already open");
        verifierSignUpOpen = true;
    }

    function whitelistVerifier(address verifier) public onlyOwner {
        verifierApplications.push(VerifierApplication(verifier, "", 0, 1, owner()));

        verifiers[verifier] = true;
    }
    

    function getVerifierReward(address _verifier) public view returns (uint256 reward) {

        uint currentVerifierActionCount = 0;
        uint currentVerifierContribution = 0;
        uint totalContribution = 0;
        uint totalActionCount = 0;

        for (uint i; i < verifierApplications.length; i++) {
            if (verifierApplications[i].status == 1) {

                uint actionCount = InsurancePool(poolAddress).verifierActionCount(verifierApplications[i].user);
                uint contribution = verifierApplications[i].contributionAmount;
                if (verifierApplications[i].user == _verifier) {

                    currentVerifierActionCount = actionCount;
                    currentVerifierContribution = contribution;
                }

                totalContribution += contribution;

                totalActionCount = actionCount;
            }
        }

        uint ratio = currentVerifierActionCount * currentVerifierContribution * 1e18 /(totalActionCount * totalContribution);

        reward = ratio * totalContribution / 1e18;
    }

    function getPendingVerifierAplications() public view returns (VerifierApplication[] memory pending) {

        VerifierApplication[] memory potentialVerifiers = verifierApplications;

        pending = new VerifierApplication[](verifierApplications.length - verifierCount);

        uint256 index = 0;

        for (uint256 i = 0; i < potentialVerifiers.length; i++) {
            if (potentialVerifiers[i].status == 0) {

                pending[index] = potentialVerifiers[i];
                index += 1;
            }
        }
    }

    function getVerifiers() public view returns (VerifierApplication[] memory) {

        return verifierApplications;
    }





}