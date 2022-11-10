import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import PackageDetail from './components/PackageDetail';
import Profile from './components/Profile';
import Web3 from "web3";
import Web3Modal from "web3modal";

function App() {

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

  const connectWallet = async (router) => {
		const providerOptions = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
					infuraId: process.env.NEXT_PUBLIC_INFURA_APP_ID,
				},
			},
		};
		const web3Modal = new Web3Modal({
			theme: 'dark',
			network: 'mainnet', // optional
			cacheProvider: true, // optional
			providerOptions, // required
			//disableInjectedProvider: false
		});
		try {
			const provider = await web3Modal.connect();

			const web3 = new Web3(provider);

			//  Get Accounts
			const accounts = await web3.eth.getAccounts();

			if (accounts.length > 0) {
				//Get Balance
				let balance;
				await web3.eth.getBalance(`${accounts[0]}`, function (err, result) {
					if (err) {
						
					} else {
						balance = convertToEther(web3, result);
					}
				});
				localStorage.setItem('isWalletConnected', 'true');
				localStorage.setItem('count', '1');

				const count = localStorage.getItem('count');

				count !== '1'
					? setAlert('Wallet Connected', NotificationType.SUCCESS)
					: null;
				//router.push('/dashboard');
			}
		} catch (error) {
			setAlert((error).message, NotificationType.ERROR);
		}
	};

  




  const home = 
    <Home packages={packages}/>

  return (
    <Routes>
      <Route path= "/" element = {
        <Layout children={home} />
      } />
      <Route path= "/profile" element = {
        <Profile />
      } />
      <Route path= "/packages/:packageType" element = {
        <PackageDetail packages={packages}/>
      } />
    </Routes>

    
  );
}

export default App;
