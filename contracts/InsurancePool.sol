// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Token.sol";
import "./Verifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./USDTInterface.sol";

contract InsurancePool {

    struct RegistrationVerifiers {
        address[] approvers;
        address[] decliners;
    }

    struct Registration {
        uint tokenType;
        string docsURI;
        address user;
        uint status;
    }

    struct Pool {
        uint numberOfParticipants;
        bytes poolCode;
        address creator;
        uint totalInvestment;
        address[] contributors;
    }

    DeInsureToken tokenAddress;
    Verifier verifierContractAddress;

    USDTInterface public immutable usdtAddress;
    Registration[] public registrations;

    mapping (uint => address[]) enrolledUsers;
    mapping (uint => RegistrationVerifiers) registrationVerifiers;
    mapping (address => uint) verifierActionCount;
    mapping(address => mapping(bytes => uint)) contributionPoolAmounts;


    event RegisterForInsurance(uint tokenType, address user, string docsURI);
    event VerifyRegistrationDocs(address verifier, address user);

    modifier isVerifier {
        require(verifierContractAddress.isVerifier(msg.sender), "Not a valid verifier");
        _;
    }

    constructor (address usdtAddress, address verifierContract) {
        usdtAddress = USDTInterface(usdtAddress);
        verifierContractAddress = Verifier(verifierContract);
    }

    function hasCheckedReg(address verifier, _registrationId) public view returns (bool) {
        address[] memory verifiers = registrationVerifiers[_registrationId];

        for (uint i = 0; i < verifiers.approvers.length; i++) {
            if (verifiers.approvers[i] == verifier) return true;
        }

        for (uint i = 0; i < verifiers.decliners.length; i++) {
            if (verifiers.decliners[i] == verifier) return true;
        }

        return false;
    }

    function registerForInsurance(string memory supportingDocsURI, uint tokenType) public {
        require(enrolmentStatus(msg.sender, tokenType) == -1 || enrolmentStatus(msg.sender, tokenType) == 2, "User already has a pending or active registration");

        Registration memory reg = Registration(tokenType, supportingDocsURI, msg.sender, 0);

        emit RegisterForInsurance(tokenType, msg.sender, supportingDocsURI);
    }


    function enrolmentStatus(address _user, uint _tokenType) private view returns (int) {
        for (uint i = 0; i < registrations.length; i++) {
            if (registrations[i].user == _user && registrations[i].tokenType == _tokenType) {
                return registrations[i].status;
            }

        }
        return -1;
    }

    function verifyRegistration(uint _registrationId) public isVerifier {
        require(_registrationId < registrations.length, "Not a valid registration id");
        Registration memory reg = registrations[_registrationId];

        require(reg.status == 0 && !hasCheckedReg(msg.sender, _registrationId), "Already called this function on this registration.");

        registrationVerifiers[_registrationId].push(msg.sender);

        // check if up to 70% of verifiers have approved registration, and confirm it.
        if ((veriferContractAddress.verifierCount() * 7) <= (registrationVerifiers[_registrationId].approvers.length * 10)) {
            registrations[_registrationId].status = 1;
        }

        verifierActionCount[msg.sender] += 1;

    }

    function objectRegistration(uint _registrationId) public isVerifier {
        require(_registrationId < registrations.length, "Not a valid registration id");
        Registration memory reg = registrations[_registrationId];

        require(reg.status == 0 && !hasCheckedReg(msg.sender, _registrationId), "Already called this function on this registration.");

        registrationVerifiers[_registrationId].decliners.push(msg.sender);

        // check if up to 50% of verifiers have declined registration, and completely decline it.
        if ((veriferContractAddress.verifierCount() * 5) <= (registrationVerifiers[_registrationId].decliners.length * 10)) {
            registrations[_registrationId].status = 1;
        }

        verifierActionCount[msg.sender] += 1;      
    }


    function makeClaim()

}
