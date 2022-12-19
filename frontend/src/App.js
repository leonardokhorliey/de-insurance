
import { useEffect, useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PackageDetail from './components/PackageDetail';
import Profile from './components/Profile';
import Web3 from 'web3/dist/web3.min.js';
// import * as dotenv from "dotenv";
import TokenContract from './abis/Token.json';
import VerifierContract from './abis/Verifier.json';
import ERC20Contract from './abis/ERC20Mock.json';
import InsuranceContract from './abis/Insurance.json';
import convertToEther from './helpers/convertToEther';
import PackageList from './components/PackageList';

// dotenv.config()

const contractAddresses = {
  tokenContract: process.env.REACT_APP_PUBLIC_TOKEN_CONTRACT_ADDRESS,
  verifierContract: process.env.REACT_APP_PUBLIC_VERIFIER_CONTRACT_ADDRESS,
  insuranceContract: process.env.REACT_APP_PUBLIC_INSURANCE_CONTRACT_ADDRESS,
  erc20Contract: process.env.REACT_APP_PUBLIC_USDT_CONTRACT_ADDRESS
}

console.log(contractAddresses);

function App() {
  const navigate = useNavigate();

  const [loaded, setLoaded] = useState(0);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [userType, setUserType] = useState('regular');
  const [selectedAccount, setSelectedAccount] = useState('');
  const [tokenContract, setTokenContract] = useState({});
  const [verifierContract, setVerifierContract] = useState({});
  const [insuranceContract, setInsuranceContract] = useState({});
  const [web3, setWeb3] = useState();
  const [balance, setBalance] = useState();
  const [USDTBalance, setUSDTBalance] = useState();

  const [packages, setPackages] = useState([
    {
        id: 1,
        name: 'Life Bounty',
        description: 'Save stable Coins for your family in the near future.',
        img: ""
    },
    {
        id: 2,
        name: 'Vehicle Fringe',
        description: 'Life happens, and your car is also living its own.',
        img: ""
    },
    {
        id: 3,
        name: 'Abode Ledger',
        description: 'You\'ve built that house, or did you do a lease? Someone could be answering a call with steaks in the pan',
        img: ""
    },
    {
        id: 4,
        name: 'Embrace Education',
        description: 'It\'s hard in every continent. Do your own on us.',
        img: ""
    },
  ])

  const connectWallet = async () => {
    let provider = window.ethereum;
    console.log(provider);
    setLoaded(1)

    
  
    if (typeof provider !== 'undefined') {
      const web3 = new Web3(provider);
      provider
        .request({ method: 'eth_requestAccounts' })
        .then(async (accounts) => {
          setSelectedAccount(accounts[0]);
          console.log(`Selected account is ${accounts[0]}`);
          setIsSignedIn(true);
          setLoaded(2)

          localStorage.setItem('activeAccount', accounts[0])
          setInitialConfigurations(web3, accounts[0]);
        })
        .catch((err) => {
          console.log(err);
          return;
        });
  
      window.ethereum.on('accountsChanged', function (accounts) {
        setLoaded(1)
        setSelectedAccount(accounts[0]);
        console.log(`Selected account changed to ${accounts[0]}`)
        localStorage.setItem('activeAccount', accounts[0])
        setTimeout(() => setLoaded(2), 1000)
        setInitialConfigurations(web3, accounts[0])
      });

    }
    
  };

  const disconnectWallet = () => {
    localStorage.removeItem('activeAccount');
    navigate('/');

  }


  useEffect(() => {
    const activeAccount = localStorage.getItem('activeAccount');
    if (activeAccount) {
      connectWallet();
      return;
    }

    // init();
  }, [])

  const setInitialConfigurations = async (web3, address) => {
    const tokenContract = new web3.eth.Contract(
      TokenContract.abi,
      contractAddresses.tokenContract
    );

    const verifierContract = new web3.eth.Contract(
      VerifierContract.abi,
      contractAddresses.tokenContract
    );

    const insuranceContract = new web3.eth.Contract(
      InsuranceContract.abi,
      contractAddresses.tokenContract
    );

    const erc20Contract = new web3.eth.Contract(
      ERC20Contract.abi,
      contractAddresses.erc20Contract
    );


    setTokenContract(tokenContract);

    setVerifierContract(verifierContract);

    setInsuranceContract(insuranceContract);
    await getNativeChainBalance(web3, address);
    setUSDTBalance(convertToEther(web3, await erc20Contract.methods.balanceOf(address).call()));
    // await getUserType(verifierContract, tokenContract, address);
    await getPackageTypes(tokenContract);
  }

  const getNativeChainBalance = async (web3, address) => {

    console.log("Na me");

    const balanceInWei = await web3.eth.getBalance(address);
    const balanceInEther = convertToEther(web3, balanceInWei);

    setBalance(balanceInEther);
  }

  const getUserType = async (verifierContract, tokenContract, address) => {
    console.log(verifierContract);
    const isVerifier = await verifierContract.methods.verifiers(address).call();
    console.log(isVerifier);
    const contractOwner = await tokenContract.methods.owner().call();
    const isOwner = contractOwner === address;
    
    setUserType(isOwner ? 'owner' : 'regular');
  }

  const getPackageTypes = async (tokenContract) => {

    const pkgs = await tokenContract.methods.getPackages().call();

    console.log(pkgs);

    let packages = [];
    const packageFullData = [];
    
    pkgs.forEach(async (pkg, idx) => {
      let pkag = {};
      pkag.tokenId = pkg.tokenId;
      pkag.premiumPercentage = pkg.premiumPercentage;
      packages.push(pkag);

      const token = await tokenContract.methods.uri(pkg.tokenId).call();
      const response = await fetch(token.replace('{id}.sol', `${pkg.tokenId.toString()}.json`));

      if(!response.ok)
      console.log("Error fetching token URI");

      console.log(response);

      const jsonData = await response.json();
      console.log(jsonData);
      packageFullData.push({...jsonData, id: pkg.tokenId});

      if (idx === pkgs.length - 1) setPackages(packageFullData);
    });

  }

  const registerForInsurance = async(docsURI, tokenType, valuation) => {
    try {
      await insuranceContract.methods.registerForInsurance(docsURI, tokenType, (valuation*100000000).toString()).send({from: selectedAccount});
      alert("Registered successfully. Wait for approval now");

    } catch (e) {
      alert(e.message);
    }
  }
  




  const home = 
    <Home packages={packages}/>

  return (
    <Routes>
      <Route path= "/" element = {
        <Layout children={home} signedIn={isSignedIn} connectWallet={() => connectWallet()} balance={balance} address={selectedAccount}/>
      } />
      <Route path= "/profile" element = {
        <Profile address={selectedAccount} balances = {{eth: balance, usdt: USDTBalance}} disconnectWallet={disconnectWallet}/>
      } />
      <Route path= "/packages/:packageType" element = {
        <PackageDetail packages={packages} signedIn={isSignedIn} connectWallet={() => connectWallet()} balance={balance} address={selectedAccount} setUploadedDocsURI={registerForInsurance} />
      } />
      <Route path= "/packages" element = {
        <Layout children={<PackageList packages= {packages}/>} signedIn={isSignedIn} connectWallet={() => connectWallet()} balance={balance} address={selectedAccount}/>
        
      } />
    </Routes>

    
  );
}

export default App;
