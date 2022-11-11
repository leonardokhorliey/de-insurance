// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

struct ConfirmWithValuation {
    uint256 valuationAmount;
    address verifier;
}

struct RegistrationVerifiers {
    ConfirmWithValuation[] approvers;
    address[] decliners;
}

struct ClaimVerifiers {
    address[] approvers;
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
//ERC115 is representing categories of insurance e.g, premium, third party e.t.c
//the IPFS contains an object that holds the documents url, other meta data like name, ...
struct Claim {
    string docsURI;
    uint256 amount;
    address user;
    uint256 tokenType; //this represents the type of the insurance e.g premium, third party
    uint256 status;
    uint256 createdAt;
}