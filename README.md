# De-Insure

De-Insure seeks to give a global chain of users access to on-chain insurance tokens. It focuses on giving people the opportunity to buy insurance packages and pay with stable coins. 

Insurance packages are defined by the contract sooner based on options in the market. These packages could include regular off-chain packages like life insurance, vehicle insurance, house insurance, and so on. Upon creation of these packages, users can then come online and register for the package.
<br>

## Fundamentals
--------------------
The fundamental implementation of De-Insure involves three types of users, and they are as below:

1. The verifier, 
2. Regular user and 
3. contract owner. 


A deep dive can be found in the docs [here](https://docs.google.com/document/d/1_G3w3AMofF8dsvJJIiocLK9cbhnXURTEcQKGaXebV0s/edit).


# Running Project

1. Clone the repo
`git clone`

2. Run the following commands 
```
cd de-insurance
npm install
npx hardhat compile
```

3. For a local development Hardhat node, run `npx hardhat node`


# Resources Used

1. [IPFS](https://ipfs.io)
2. [Moralis v2.7.2](https://moralis.io)
3. [Binance Smart Chain Testnet](https://testnet/bscscan.com)

<br>

Front end code is available in the `/frontend` directory. Go through the [README.md](https://github.com/leonardokhorliey/de-insurance/tree/main/frontend/README.md) for details on how to run locally.

<br>

# Verified Contract Addresses

`De-Insure Token (ERC1155)` - https://testnet.bscscan.io/address/0xFEde36aDfbb1c8EA6A3CE88960E7599ca01a328F#code

`Verifier Contract` - https://testnet.bscscan.io/address/0x53408c2750404b5a43dfAceF67B006a5c56c7E84#code

`De-Insure Main Contract` - https://testnet.bscscan.io/address/0x5ea018db6cBD76Bac28fB3Fa492469F1523218C7#code
