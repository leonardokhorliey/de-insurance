import React, { useState, useEffect, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { abis, contractAddresses } from '../abis';
import { AppContext } from '.';

export const USDTContext = createContext();

const getUsdtContract = (ethObject) => {
    const provider = new ethers.providers.Web3Provider(ethObject);
    const signer = provider.getSigner();

    return new ethers.Contract(contractAddresses.erc20Contract, abis.usdt, signer);
}

export const USDTProvider = ({children}) => {
    const [usdtContract, setUsdtContract] = useState()
    const [usdtBalance, setUsdtBalance] = useState()
    const [decimals, setDecimals] = useState('8')
    const [approvalDone, setApprovalDone] = useState(true)
    const { ethereum, errorAlert, setLoading, selectedAccount } = useContext(AppContext)

    const approveContractForAmount = async (addressToApprove, amount) => {
        setLoading(true);
        try {
            await usdtContract.approve(addressToApprove, (amount*Number(`1e${decimals}`)).toString())
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
        setApprovalDone(true);
    }

    const getUsdtBalance = async (address) => {
        try {
            const balance = ethers.utils.formatEther(await usdtContract.balanceOf(address));
            console.log("USDT ", balance)
            setUsdtBalance(balance);
        } catch (e) {
            errorAlert(e.message);
        }
    }

    const getDecimals = async () => {
        try {
            const balance = await usdtContract.decimals();
            setDecimals(balance);
        } catch (e) {
            errorAlert(e.message);
        }
    }

    useEffect(() => {
        setUsdtContract(getUsdtContract(ethereum));

    }, [ethereum])

    useEffect(() => {
        if(usdtContract && selectedAccount) {
            getUsdtBalance(selectedAccount);
            getDecimals();
        }
        
    }, [usdtContract, selectedAccount])

    return (
        <USDTContext.Provider value={{
            approveContractForAmount,
            setApprovalDone,
            usdtBalance,
            approvalDone,
            decimals
        }}>
            {children}
        </USDTContext.Provider>
    )
}