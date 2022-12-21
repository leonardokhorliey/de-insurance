// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import {uploadImage, uploadToIpfs} from "./moralis";
import * as dotenv from "dotenv";
const tokenJson = require('../artifacts/contracts/Token.sol/DeInsureToken.json');

dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  console.log("Hi")
  const dataForCode = await uploadImage('code.png', true, 'Comprehensive Vehicle Insurance', 'Insure your vehicle with a full comprehensive insurance', '9.00');
  console.log("Yo")
  const dataForPic = await uploadImage('pic.png', false, '3rd-Party Vehicle Insurance', 'Save the time for the delay. Let\'s cover you when you make mistakes.', '15.28');

  const jsonData1 = await uploadToIpfs([
    {
      path: `2.json`,
      content: dataForCode
    },
  ], false);

  const jsonData2 = await uploadToIpfs([
    {
      path: `3.json`,
      content: dataForPic
    }
  ], false)

  const ipfsUrl = jsonData1[0].path.replace('/2.json', '');

  console.log(ipfsUrl);


  const MockUSDT = await ethers.getContractFactory("ERC20Mock");
  const mockUSDT = await MockUSDT.deploy();

  await mockUSDT.deployed();

  console.log("Token deployed to:", mockUSDT.address);

  const Token = await ethers.getContractFactory("DeInsureToken");
  const token = await Token.deploy();

  await token.deployed();

  await token.createNewPackage('900', jsonData1[0].path);
  await token.createNewPackage('1528', jsonData2[0].path);

  console.log("Token deployed to:", token.address);



//   const alchemyProvider = new ethers.providers.AlchemyProvider("maticmum", process.env.ALCHEMY_API_KEY);

// // Signer
//   const signer = new ethers.Wallet(process.env.PRIVATE_KEY || '', alchemyProvider);

// // Contract
//   const token = new ethers.Contract("0xAE657Be47195f0a2AC3b13c3fd1BA30A3C6234Bd", tokenJson.abi, signer);

  const Verifier = await ethers.getContractFactory("Verifier");
  const verifier = await Verifier.deploy(mockUSDT.address);

  await verifier.deployed();

  console.log("Verifier deployed to:", verifier.address);

  const Pool = await ethers.getContractFactory("InsurancePool");
  const pool = await Pool.deploy(mockUSDT.address, verifier.address, token.address);

  await pool.deployed();

  console.log("Pool Manager deployed to:", pool.address);

  await verifier.setPoolAddress(pool.address);
  await token.setPoolAddress(pool.address);


}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});