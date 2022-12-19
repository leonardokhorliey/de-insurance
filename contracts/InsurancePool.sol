// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "./Token.sol";
import "./Verifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./USDTInterface.sol";
import {
    ConfirmWithValuation,
    RegistrationVerifiers,
    ClaimVerifiers,
    Registration,
    Claim
} from "./ContractStructs.sol";

contract InsurancePool {

    DeInsureToken tokenContract;
    Verifier verifierContract;

    USDTInterface public immutable usdtContract;
    Registration[] public registrations;
    Claim[] public claims;

    mapping(uint256 => address[]) tokenTypeToEnrolledUsers; //Token Type represents the tokenId
    mapping(uint256 => mapping(address => uint256)) tokenTypeToUserToRegId;
    mapping(uint256 => RegistrationVerifiers) registrationVerifiers;
    mapping(uint256 => ClaimVerifiers) claimVerifiers; 
    mapping(address => uint256) public verifierActionCount;
    uint256 public contributionPoolAmounts;
    mapping(address => Registration[]) public userToRegistration;
    mapping(address => Claim[]) public userToClaim;

    event RegisterForInsurance(
        uint256 tokenType,
        address user,
        string docsURI,
        uint256 valuation
    );
    event VerifyRegistrationDocs(
        address verifier,
        uint _registrationId,
        uint256 valuation
    );
    event RejectRegistrationDocs(address verifier, uint _registrationId);
    event PayPremium(address user, uint256 amount);
    event MakeClaim(
        uint256 tokenType,
        address user,
        string docsURI,
        uint256 amount
    );
    event VerifyClaim(address verifier, uint256 claimId);

    modifier isVerifier() {
        require(
            verifierContract.isVerifier(msg.sender),
            "Not a valid verifier"
        );
        _;
    }

    constructor(address _usdtAddress, address verifierContractAddress, address _tokenContractAddress) {
        usdtContract = USDTInterface(_usdtAddress);
        verifierContract = Verifier(verifierContractAddress);
        tokenContract = DeInsureToken(_tokenContractAddress);
    }

    function registerForInsurance(
        string memory supportingDocsURI,
        uint256 tokenType,
        uint256 valuationAmount
    ) public {
        require(
            enrolmentStatus(msg.sender, tokenType) == -1 ||
                enrolmentStatus(msg.sender, tokenType) == 2,
            "User already has a pending or active registration"
        );

        Registration memory reg = Registration(
            tokenType,
            supportingDocsURI,
            msg.sender,
            0,
            block.timestamp,
            valuationAmount
        );

        registrations.push(reg);

        userToRegistration[msg.sender].push(reg);

        emit RegisterForInsurance(
            tokenType,
            msg.sender,
            supportingDocsURI,
            valuationAmount
        );
    }

    function getRegistrations() public view returns (Registration[] memory) {
        return registrations;
    }

    function getClaims() public view returns (Claim[] memory) {
        return claims;
    }

    function enrolmentStatus(address _user, uint256 _tokenType)
        public
        view
        returns (int256)
    {
        for (uint256 i = 0; i < registrations.length; i++) {
            if (
                registrations[i].user == _user &&
                registrations[i].tokenType == _tokenType
            ) {
                return int256(registrations[i].status);
            }
        }
        return -1;
    }

    function verifyRegistration(
        uint256 _registrationId,
        uint256 valuationAmount
    ) public isVerifier {
        require(
            _registrationId < registrations.length,
            "Not a valid registration id"
        );
        Registration memory reg = registrations[_registrationId];

        require(
            reg.status == 0 && !hasCheckedReg(msg.sender, _registrationId),
            "Already called this function on this registration."
        );

        registrationVerifiers[_registrationId].approvers.push(
            ConfirmWithValuation(valuationAmount, msg.sender)
        );

        // check if up to 70% of verifiers have approved registration, and confirm it.
        if (
            (verifierContract.verifierCount() * 7) <=
            (registrationVerifiers[_registrationId].approvers.length * 10)
        ) {
            registrations[_registrationId].status = 1;
            registrations[_registrationId].valuationAmount =
                computeSuggestedValuation(_registrationId) /
                1e18;

            tokenTypeToEnrolledUsers[reg.tokenType].push(reg.user);
            tokenTypeToUserToRegId[reg.tokenType][msg.sender] = _registrationId;
        }

        verifierActionCount[msg.sender] += 1;
        emit VerifyRegistrationDocs(
            msg.sender,
            _registrationId,
            computeSuggestedValuation(_registrationId) / 1e18
        );
    }

    function objectRegistration(uint256 _registrationId) public isVerifier {
        require(
            _registrationId < registrations.length,
            "Not a valid registration id"
        );
        Registration memory reg = registrations[_registrationId];

        require(
            reg.status == 0 && !hasCheckedReg(msg.sender, _registrationId),
            "Already called this function on this registration."
        );

        registrationVerifiers[_registrationId].decliners.push(msg.sender);

        // check if up to 50% of verifiers have declined registration, and completely decline it.
        if (
            (verifierContract.verifierCount() * 5) <=
            (registrationVerifiers[_registrationId].decliners.length * 10)
        ) {
            registrations[_registrationId].status = 2;
        }

        verifierActionCount[msg.sender] += 1;
        emit RejectRegistrationDocs(msg.sender, _registrationId);
    }

    function computeSuggestedValuation(uint256 _registrationId)
        internal
        view
        returns (uint256)
    {
        ConfirmWithValuation[] memory regs = registrationVerifiers[
            _registrationId
        ].approvers;

        uint256 sum = 0;
        uint256 count = 0;

        for (; count < regs.length; count++) {
            sum += regs[count].valuationAmount;
        }

        return (sum * 1e18) / count;
    }

    function payPremium(uint256 _usdtAmount, uint256 _tokenType) public {

        uint256 registrationId = tokenTypeToUserToRegId[_tokenType][msg.sender];
        Registration memory reg = registrations[registrationId];
        uint256 premiumPercentage = tokenContract
            .getPackageType(reg.tokenType)
            .premiumPercentage;

        require(
            (_usdtAmount * 10000) >= (reg.valuationAmount * premiumPercentage),
            "You did not send sufficient USDT"
        );
        usdtContract.transferFrom(msg.sender, address(this), _usdtAmount);
        tokenContract.mintToClient(msg.sender, reg.tokenType, _usdtAmount);
        emit PayPremium(msg.sender, _usdtAmount);
    }

    function makeClaim(
        string memory _docURI,
        uint256 _amount,
        uint256 tokenType
    ) external {
        
        uint balanceOfToken = tokenContract.balanceOf(msg.sender, tokenType);
        uint exceedings = tokenContract.exceedingAmounts(msg.sender, tokenType);
        //Check the balance for the tokenType specified
        require (balanceOfToken * 5 > (_amount - balanceOfToken)*10 && (exceedings * 5) > (_amount - balanceOfToken)*10, "Not sufficient contribution made to make this claim");
        claims.push(Claim(
            _docURI,
            _amount,
            msg.sender,
            tokenType,
            0,
            block.timestamp
        ));

        emit MakeClaim(tokenType, msg.sender, _docURI, _amount);
    }

    function verifyClaim(uint256 claimId) external {
        Claim memory claim = claims[claimId];
        require(
            claim.status == 0 && !hasCheckedClaim(msg.sender, claimId),
            "Already called this function on this registration."
        );

        if (
            (verifierContract.verifierCount() * 7) <=
            (claimVerifiers[claimId].approvers.length * 10)
        ) {
            claims[claimId].status = 1;
            tokenContract.burnFromClient(claim.user, claim.tokenType, claim.amount);
            usdtContract.transfer(claim.user, claim.amount);
        }
        emit VerifyClaim(msg.sender, claimId);
    }



    function payoutVerifier(address verifier, uint256 amount) external {

        require(msg.sender == address(verifierContract), "Unauthorized");

        usdtContract.transfer(verifier, amount);
    }

    function hasCheckedReg(address verifier, uint256 _registrationId)
        public
        view
        returns (bool)
    {
        RegistrationVerifiers memory verifiers = registrationVerifiers[
            _registrationId
        ];

        for (uint256 i = 0; i < verifiers.approvers.length; i++) {
            if (verifiers.approvers[i].verifier == verifier) return true;
        }

        for (uint256 i = 0; i < verifiers.decliners.length; i++) {
            if (verifiers.decliners[i] == verifier) return true;
        }

        return false;
    }

    function hasCheckedClaim(address verifier, uint256 _claimId)
        public
        view
        returns (bool)
    {
        ClaimVerifiers memory verifiers = claimVerifiers[
            _claimId
        ];

        for (uint256 i = 0; i < verifiers.approvers.length; i++) {
            if (verifiers.approvers[i] == verifier) return true;
        }

        for (uint256 i = 0; i < verifiers.decliners.length; i++) {
            if (verifiers.decliners[i] == verifier) return true;
        }

        return false;
    }


    function getUserRegistrations(address user) public view returns (Registration[] memory) {
        Registration[] memory userRegistrations = userToRegistration[user];

        return userRegistrations;
    }

    function getUserClaims(address user) public view returns (Claim[] memory) {
        Claim[] memory claimsMade = userToClaim[user];

        return claimsMade;
    }

    function getUncheckedRegs(address verifier) public view returns (Registration[] memory regs) {
        regs = new Registration[](registrations.length);

        for (uint256 i = 0; i < registrations.length; i++) {
            if (!hasCheckedReg(verifier, i)) regs[i] = registrations[i];
        }
    }

    function getUncheckedClaims(address verifier) public view returns (Claim[] memory pendingClaims) {
        pendingClaims = new Claim[](claims.length);

        for (uint256 i = 0; i < claims.length; i++) {
            if (!hasCheckedClaim(verifier, i)) pendingClaims[i] = claims[i];
        }
    }


}

