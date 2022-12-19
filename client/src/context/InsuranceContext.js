import React, { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import { abis, contractAddresses } from '../abis';
import { AppContext } from '.';
import { TokenContext } from './TokenContext';
import { USDTContext } from './USDTContext';

export const InsuranceContext = createContext();

const getInsuranceContract = (ethObject) => {
    const provider = new ethers.providers.Web3Provider(ethObject);
    const signer = provider.getSigner();

    return new ethers.Contract(contractAddresses.insuranceContract, abis.insurance, signer);
}

export const InsuranceProvider = ({children}) => {
    const [insuranceContract, setInsuranceContract] = useState()
    const [registrations, setRegistrations] = useState([])
    const [packagesEnrolled, setPackagesEnrolled] = useState([])
    const [pendingRegs, setPendingRegs] = useState([])
    const [pendingClaims, setPendingClaims] = useState([])
    const [claimsMade, setClaimsMade] = useState([])
    const [claims, setClaims] = useState([])
    const { ethereum, errorAlert, setLoading, selectedAccount } = useContext(AppContext)
    const { getPackageWithTokenType } = useContext(TokenContext)
    const { decimals } = useContext(USDTContext)

    const registerForInsurance = async (docsURI, tokenType, valuation) => {
        setLoading(true);
        try {

            await insuranceContract.registerForInsurance(docsURI, tokenType, (valuation*Number(`1e${decimals}`)).toString())
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const verifyRegistration = async (registrationId, valuation) => {
        setLoading(true);
        try {
            await insuranceContract.verifyRegistration(registrationId, (valuation*Number(`1e${decimals}`)).toString())
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const objectRegistration = async (registrationId) => {
        setLoading(true);
        try {
            await insuranceContract.objectRegistration(registrationId)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const makeClaim = async (docsURI, amount, tokenType) => {
        setLoading(true);
        try {
            await insuranceContract.makeClaim(docsURI, (amount*Number(`1e${decimals}`)).toString(), tokenType)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const payPremium = async (usdtAmount, tokenType) => {
        setLoading(true);
        try {
            await insuranceContract.payPremium((usdtAmount*Number(`1e${decimals}`)).toString(), tokenType)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const verifyClaim = async (claimId) => {
        setLoading(true);
        try {
            await insuranceContract.verifyClaim(claimId)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const payoutVerifier = async (verifier, amount) => {
        setLoading(true);
        try {
            await insuranceContract.payoutVerifier(verifier, (amount*Number(`1e${decimals}`)).toString())
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const getRegistrations = async () => {
        try {
            const regs = await insuranceContract.getRegistrations();
            console.log(regs)

            const registrations = regs.map((reg, idx) => ({
                id: idx,
                tokenId: reg.tokenType,
                uri: reg.docsURI,
                user: reg.user,
                valuationAmount: reg.valuationAmount,
                createdAt: reg.createdAt,
                status: reg.status

            }))

            setRegistrations(registrations)

        } catch (e) {
            errorAlert(e.message);
            
        }
    }

    const getClaims = async () => {
        try {
            const claimsRes = await insuranceContract.getClaims();
            console.log(claimsRes)

            const claims = claimsRes.map((reg, idx) => ({
                id: idx,
                tokenId: reg.tokenType,
                uri: reg.docsURI,
                user: reg.user,
                amount: reg.amount,
                createdAt: reg.createdAt,
                status: reg.status

            }))

            setClaims(claims)

        } catch (e) {
            errorAlert(e.message);
            
        }
    }

    const getPackagesEnrolled = async (userAddress) => {
        try {
            console.log("enrolled");
            const regs = await insuranceContract.getUserRegistrations(userAddress);

            const enrolled = regs.filter(reg => reg.status == "1");
            console.log(enrolled);
            if(enrolled.length < 1) return;

            let pkgs = []

            for (let reg of enrolled) {
                const pkg = await getPackageWithTokenType(reg.tokenType)
                console.log(pkg.tokenUri)

                const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${pkg.tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

                if(!response.ok)
                console.log("Error fetching token URI");

                console.log(response);

                const jsonData = await response.json();

                pkgs.push({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri: pkg.tokenUri,
                    docsUri: reg.docsURI,
                    user: reg.user,
                    valuationAmount: reg.valuationAmount,
                    createdAt: reg.createdAt
                })
            }

            setPackagesEnrolled(pkgs)


        } catch (e) {
            errorAlert(e.message);
            console.log("I fail")
        }
    }

    const getClaimsMade = async (userAddress) => {
        try {
            const regs = await insuranceContract.getUserClaims(userAddress);

            if(regs.length < 1) return;

            let pkgs = []

            for (let reg of regs) {
                const pkg = await getPackageWithTokenType(reg.tokenType)
                console.log(pkg.tokenUri)

                const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${pkg.tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

                if(!response.ok)
                console.log("Error fetching token URI");

                console.log(response);

                const jsonData = await response.json();

                pkgs.push({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri: pkg.tokenUri,
                    docsUri: reg.docsURI,
                    user: reg.user,
                    amount: reg.amount,
                    createdAt: reg.createdAt,
                    status: reg.status
                })
            }


            setClaimsMade(pkgs)

        } catch (e) {
            errorAlert(e.message);
        }
    } 
    
    const getEnrolmentStatus = async (userAddress, tokenId) => {

        const status = await insuranceContract.enrolmentStatus(userAddress, tokenId);

        return status === '1'
    }

    const getUncheckedRegs = async (address) => {
        const regs = await insuranceContract.getUncheckedRegs(address);

        let pkgs = []

        for (let reg of regs) {
            const pkg = await getPackageWithTokenType(reg.tokenType)
            console.log(pkg.tokenUri)

            const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${pkg.tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

            if(!response.ok)
            console.log("Error fetching token URI");

            console.log(response);

            const jsonData = await response.json();

            pkgs.push({
                ...jsonData,
                tokenId: pkg.tokenId.toString(),
                premiumPercentage: pkg.premiumPercentage / 10000,
                tokenUri: pkg.tokenUri,
                docsUri: reg.docsURI,
                user: reg.user,
                valuationAmount: reg.valuationAmount,
                createdAt: reg.createdAt,
                status: reg.status
            })
        }

        setPendingRegs(pkgs)
    }

    const getUncheckedClaims = async (address) => {
        const regs = await insuranceContract.getUncheckedClaims(address);

        let pkgs = []

        for (let reg of regs) {
            const pkg = await getPackageWithTokenType(reg.tokenType)
            console.log(pkg.tokenUri)

            const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${pkg.tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

            if(!response.ok)
            console.log("Error fetching token URI");

            console.log(response);

            const jsonData = await response.json();

            pkgs.push({
                ...jsonData,
                tokenId: pkg.tokenId.toString(),
                premiumPercentage: pkg.premiumPercentage / 10000,
                tokenUri: pkg.tokenUri,
                docsUri: reg.docsURI,
                user: reg.user,
                amount: reg.amount,
                createdAt: reg.createdAt,
                status: reg.status
            })
        }

        setPendingClaims(pkgs)
    }



    useEffect(() => {
        setInsuranceContract(getInsuranceContract(ethereum))
    }, [ethereum])

    useEffect(() => {

        if (insuranceContract) {
            getRegistrations()
            getClaims()

            if (selectedAccount) {
                getPackagesEnrolled(selectedAccount)
                getClaimsMade(selectedAccount)
                getUncheckedClaims(selectedAccount)
                getUncheckedRegs(selectedAccount)
            }
            
        }
        
    }, [insuranceContract, selectedAccount])


    return (
        <InsuranceContext.Provider value={{
            registerForInsurance, 
            verifyRegistration, 
            objectRegistration, 
            makeClaim, 
            payPremium, 
            verifyClaim, 
            payoutVerifier,
            getEnrolmentStatus,
            registrations,
            claims,
            packagesEnrolled,
            claimsMade,
            pendingRegs,
            pendingClaims
        }}>
            {children}
        </InsuranceContext.Provider>
    )
}

