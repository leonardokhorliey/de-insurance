import React, { useState, useEffect, createContext } from 'react';
import { InsuranceContext, InsuranceProvider } from './InsuranceContext';
import { USDTContext, USDTProvider } from './USDTContext';
import { VerifierContext, VerifierProvider } from './VerifierContext';
import { TokenContext, TokenProvider } from './TokenContext';
import { ethers } from 'ethers';
import { abis, contractAddresses } from '../abis';

export const AppContext = createContext();

const { ethereum } = window;

export const AppContextProvider = ({children}) => {
    const [selectedAccount, setSelectedAccount] = useState('');
    const [ethBalance, setEthBalance] = useState();
    const [loading, setLoading] = useState(false);
    const [userType, setUserType] = useState('regular')
    const [isOwner, setIsOwner] = useState(false)
    const [isVerifier, setIsVerifier] = useState(false)

    const errorAlert = (message) => {
        console.log("Process failed with error ", message);
    }

    const checkIfWalletIsConnected = async () => {
        const accounts = await ethereum.request({method: 'eth_accounts'});

        if (accounts.length > 0) {
            setSelectedAccount(accounts[0]);
            setEthBalance(await getEthBalance(accounts[0]))
        }
        
    }

    const getEthBalance = async (account) => {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const balance = await provider.getBalance(account);

        return ethers.utils.formatEther(balance);
    }

    const connectWallet = async () => {
        try {
            if (!ethereum) return alert("Please install a Wallet Provider");

            const accounts = await ethereum.request({method: 'eth_requestAccounts'});

            const balance = await getEthBalance(accounts[0]);

            setEthBalance(balance);

            setSelectedAccount(accounts[0]);
        } catch (e) {
            errorAlert(e.message);
        }

        ethereum.on('accountsChanged', function (accounts) {
            setSelectedAccount(accounts[0]);
        });
    }

    const getUserType = () => {
        if (isOwner) setUserType('owner');
        else if (isVerifier) setUserType('verifier')
        else setUserType('regular')
    }

    const disconnectWallet = () => {

    }


    useEffect(() => {
        checkIfWalletIsConnected()
    }, [])

    useEffect(() => {
        getUserType()
    }, [isOwner, isVerifier])

    return (
        <AppContext.Provider value={{ethereum, 
            connectWallet, 
            errorAlert, 
            disconnectWallet, 
            setLoading, 
            setIsOwner,
            setIsVerifier,
            loading, 
            selectedAccount, 
            ethBalance,
            contractAddresses,
            userType
        }}>
            <USDTProvider>
                <TokenProvider>
                    <VerifierProvider>
                        <InsuranceProvider>
                            {children}
                        </InsuranceProvider>
                    </VerifierProvider>
                </TokenProvider>
            </USDTProvider>
        </AppContext.Provider>
    )
}