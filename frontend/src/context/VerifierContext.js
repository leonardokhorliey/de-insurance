import React, { useState, useEffect, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { abis, contractAddresses } from '../abis';
import { USDTContext } from './USDTContext';
import { AppContext } from '.';

export const VerifierContext = createContext();

const getVerifierContract = (ethObject) => {
    const provider = new ethers.providers.Web3Provider(ethObject);
    const signer = provider.getSigner();

    return new ethers.Contract(contractAddresses.verifierContract, abis.verifier, signer);
}

export const VerifierProvider = ({children}) => {
    const [verifierContract, setVerifierContract] = useState()
    const [verifier, setVerifier] = useState(false)
    const [pendingVerifiers, setPendingVerifiers] = useState([])
    const [verifiers, setVerifiers] = useState([])
    const { ethereum, errorAlert, setLoading, selectedAccount, setIsVerifier, setIsOwner, stableCoinConverter } = useContext(AppContext)
    const { decimals } = useContext(USDTContext)

    const registerAsVerifier = async (docsURI, contribution) => {
        contribution = stableCoinConverter.convertStableCoinToBN(contribution, decimals)
        setLoading(true);
        try {
            await verifierContract.registerAsVerifier(docsURI, contribution);
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const checkIfVerifier = async (account) => {
        try {
            const check = await verifierContract.isVerifier(account);
            setIsVerifier(check);
        } catch (e) {
            errorAlert(e.message);
        }
    }

    const approveVerifierRegistration = async (potentialVerifier) => {
        setLoading(true);
        try {
            await verifierContract.approveVerifierRegistration(potentialVerifier)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const declineVerifierRegistration = async (potentialVerifier) => {
        setLoading(true);
        try {
            await verifierContract.declineVerifierRegistration(potentialVerifier)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const blacklistVerifier = async (verifier) => {
        setLoading(true);
        try {
            await verifierContract.blacklistVerifier(verifier)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const getVerifiers = async () => {
        const apps = await verifierContract.getVerifiers();

        const p = apps.map((app) => {
            return {
                address: app.user,
                docsUri: app.supportingDocsURI,
                contribution: stableCoinConverter.convertBNToStableCoin(app.contributionAmount.toString(), decimals),
                whitelist: app.creator === app.user ? true : false,
                status: app.status.toString()
            }
        })

        const approved = p.filter(k => k.status === '1');

        const pending = p.filter(k => k.status === '0');

        setPendingVerifiers(pending)
        setVerifiers(approved)

    }

    const isContractOwner = async (address) => {
        const owner = await verifierContract.owner();
        console.log(owner);
        console.log(address);
        console.log(owner.toLowerCase() === address.toLowerCase())
        setIsOwner(owner.toLowerCase() === address.toLowerCase())
        setVerifier(owner === address)
    }

    useEffect(() => {
        setVerifierContract(getVerifierContract(ethereum))
    }, [ethereum])

    useEffect(() => {
        if(verifierContract && selectedAccount) {
            checkIfVerifier(selectedAccount)
            isContractOwner(selectedAccount)
            getVerifiers()
        }
    }, [verifierContract, selectedAccount])

    return (
        <VerifierContext.Provider value={{
            registerAsVerifier,
            approveVerifierRegistration,
            declineVerifierRegistration,
            blacklistVerifier,
            pendingVerifiers
        }}>
            {children}
        </VerifierContext.Provider>
    )
}