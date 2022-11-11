// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Token.sol";
import "./Verifier.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./USDTInterface.sol";

contract InsurancePool {
    struct ConfirmWithValuation {
        uint256 valuationAmount;
        address verifier;
    }

    struct RegistrationVerifiers {
        ConfirmWithValuation[] approvers;
        address[] decliners;
    }

    struct Registration {
        uint256 tokenType;
        string docsURI;
        address user;
        uint256 status;
        uint256 createdAt;
        uint256 valuationAmount;
    }

    struct Pool {
        uint256 numberOfParticipants;
        bytes poolCode;
        address creator;
        uint256 totalInvestment;
        address[] contributors;
    }
    //ERC115 is representing categories of insurance e.g, premium, third party e.t.c
    //the IPFS contains an object that holds the documents url, other meta data like name, ...
    struct Claim {
        string docsURI;
        uint256 amount;
        address userAddress;
        uint256 tokenType; //this represents the type of the insurance e.g premium, third party
        uint256 status;
        uint256 createdAt;
        address[] verifiers;
        address[] decliners;
    }

    DeInsureToken tokenContract;
    Verifier verifierContract;

    USDTInterface public immutable usdtContract;
    Registration[] public registrations;
    Claim[] public claims;

    mapping(uint256 => address[]) tokenTypeToEnrolledUsers; //Token Type represents the tokenId
    mapping(uint256 => RegistrationVerifiers) registrationVerifiers; //generate unique random key
    mapping(address => uint256) verifierActionCount;
    mapping(address => mapping(bytes => uint256)) contributionPoolAmounts;
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
        address user,
        uint256 valuation
    );
    event RejectRegistrationDocs(address verifier, address user);
    event PayPremium(address user, uint256 amount);
    event MakeClaim(address user, uint256 amount);
    event VerifyClaim(address verifier, uint256 claimId);

    modifier isVerifier() {
        require(
            verifierContract.isVerifier(msg.sender),
            "Not a valid verifier"
        );
        _;
    }

    constructor(address _usdtAddress, address verifierContractAddress) {
        usdtContract = USDTInterface(_usdtAddress);
        verifierContract = Verifier(verifierContractAddress);
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

        userToRegistration[msg.sender].push(reg);

        emit RegisterForInsurance(
            tokenType,
            msg.sender,
            supportingDocsURI,
            valuationAmount
        );
    }

    function enrolmentStatus(address _user, uint256 _tokenType)
        private
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
        }

        verifierActionCount[msg.sender] += 1;
        emit VerifyRegistrationDocs(
            msg.sender,
            reg.user,
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
        emit RejectRegistrationDocs(msg.sender, reg.user);
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

    function payPremium(uint256 _usdtAmount, uint256 _registrationId) public {
        Registration memory reg = registrations[_registrationId];
        uint256 premiumPercentage = tokenContract
            .getPackageType(reg.tokenType)
            .premiumPercentage;

        require(
            (_usdtAmount * 10000) >= (reg.valuationAmount * premiumPercentage),
            "You did not send sufficient USDT"
        );
        usdtContract.transfer(address(this), _usdtAmount);
        emit PayPremium(msg.sender, _usdtAmount);
    }

    function makeClaim(
        string memory _docURI,
        uint256 _amount,
        uint256 tokenType
    ) external {
        //Check the balance for the tokenType specified
        //TODO Verify that you meet up with your monthly subscription

        Claim memory claim = Claim(
            _docURI,
            _amount,
            msg.sender,
            tokenType,
            0,
            block.timestamp,
            new address[](0),
            new address[](0)
        );
        claims.push(claim);

        emit MakeClaim(msg.sender, _amount);
    }

    // function getUnverifiedClaims() external {
    //     Claim[]  storage response;

    //     for(uint i = 0; i < claims.length; i++){
    //         if(claims[i].status == 0){
    //           response.push(claims[i]);
    //         }
    //     }
    // }

    function verifyClaim(uint256 claimId) external {
        Claim storage claim = claims[claimId];
        uint256 totalVerifiers = verifierContract.verifierCount();
        uint256 totalVerifiersForClaim = claim.verifiers.length;

        if ((totalVerifiers * 7) <= (totalVerifiersForClaim * 10)) {
            claim.status = 1;
            usdtContract.transfer(msg.sender, claim.amount);
        }
        claims[claimId].verifiers.push(msg.sender);
        emit VerifyClaim(msg.sender, claimId);
    }
}

//Technical Debt
//We need to mint the token type to the user when a user pays for the subscription
