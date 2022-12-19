import React, { useState, useEffect, useContext, createContext } from 'react';
import { ethers } from 'ethers';
import { abis, contractAddresses } from '../abis';
import { AppContext } from '.';
import axios from 'axios';

export const TokenContext = createContext();

const getTokenContract = (ethObject) => {
    const provider = new ethers.providers.Web3Provider(ethObject);
    const signer = provider.getSigner();

    return new ethers.Contract(contractAddresses.tokenContract, abis.token, provider);
}

export const TokenProvider = ({children}) => {
    const [tokenContract, setTokenContract] = useState()
    const [packages, setPackages] = useState([])
    const { ethereum, errorAlert, setLoading } = useContext(AppContext)

    const createNewPackage = async (premiumPercentage, docsURI) => {
        setLoading(true);
        try {

            const premium = (premiumPercentage*100).toString();
            await tokenContract.createNewPackage(premium, docsURI)
        } catch (e) {
            errorAlert(e.message);
        }

        setLoading(false);
    }

    const getPackages = async () => {
        try {
            const packages = await tokenContract.getPackages();
            console.log("Packages", packages)

            let pkgs = [];

            for (let pkg of packages) {
                const tokenUri = await tokenContract.uri(pkg.tokenId);
                console.log(tokenUri)

                const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

                if(!response.ok)
                console.log("Error fetching token URI");

                console.log(response);

                const jsonData = await response.json();
                console.log({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri
                });

                pkgs.push({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri
                })
            }

            
            setPackages(pkgs);
        } catch (e) {
            errorAlert(e.message);
            console.log("I fail")
        }
    }

    const getPackagesWithTokenTypes = async (tokenTypes) => {
        let pkgs = []
        try {

            for (let token of tokenTypes) {
                const pkg = await tokenContract.getPackageType(token);
                const tokenUri = await tokenContract.uri(token);

                const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

                if(!response.ok)
                console.log("Error fetching token URI");

                console.log(response);

                const jsonData = await response.json();
                console.log({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri
                });

                pkgs.push({
                    ...jsonData,
                    tokenId: pkg.tokenId.toString(),
                    premiumPercentage: pkg.premiumPercentage / 10000,
                    tokenUri
                })
            }

            return pkgs;

        } catch (e) {
            
            errorAlert(e.message);
            return [];
        }
    }

    const getPackageWithTokenType = async (tokenType) => {
        const pkg = await tokenContract.getPackageType(tokenType);
        const tokenUri = await tokenContract.uri(tokenType);

        const response = await fetch(`https://gateway.moralisipfs.com/ipfs/${tokenUri.replace('https://ipfs.moralis.io:2053/ipfs/', '')}`);

        if(!response.ok)
        console.log("Error fetching token URI");

        console.log(response);

        const jsonData = await response.json();

        return {
            ...jsonData,
            tokenId: ethers.utils.formatEther(pkg.tokenId),
            premiumPercentage: pkg.premiumPercentage / 10000,
            tokenUri
        }     
    }




    useEffect(() => {
        setTokenContract(getTokenContract(ethereum))

    }, [ethereum])

    useEffect(() => {
        if(tokenContract) getPackages()
    }, [tokenContract])

    return (
        <TokenContext.Provider value={{
            createNewPackage,
            getPackagesWithTokenTypes,
            getPackageWithTokenType,
            packages
        }}>
            {children}
        </TokenContext.Provider>
    )
}