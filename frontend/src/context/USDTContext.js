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
    const { ethereum, errorAlert, setLoading, selectedAccount, stableCoinConverter } = useContext(AppContext)

    const approveContractForAmount = async (addressToApprove, amount) => {
        console.log(addressToApprove, amount)
        amount = stableCoinConverter.convertStableCoinToBN(amount.toString(), decimals)
        try {
            await usdtContract.approve(addressToApprove, amount)
            setApprovalDone(true);
        } catch (e) {
            errorAlert(e.message);
        }
        
    }

    const getUsdtBalance = async (address) => {
        try {
            const balance = await usdtContract.balanceOf(address);
            const decimals = Number(await usdtContract.decimals());
            const bal = stableCoinConverter.convertBNToStableCoin(balance.toString(), decimals)
            console.log("USDT ", bal)
            setUsdtBalance(bal);
        } catch (e) {
            errorAlert(e.message);
        }
    }

    const getDecimals = async () => {
        try {
            const balance = await usdtContract.decimals();
            setDecimals(Number(balance));
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