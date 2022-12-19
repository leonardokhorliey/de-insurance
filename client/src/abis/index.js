import TokenContract from './Token.json';
import VerifierContract from './Verifier.json';
import ERC20Contract from './ERC20Mock.json';
import InsuranceContract from './Insurance.json';


export const abis = {
    token: TokenContract.abi,
    verifier: VerifierContract.abi,
    usdt: ERC20Contract.abi,
    insurance: InsuranceContract.abi
}

export const contractAddresses = {
    tokenContract: process.env.REACT_APP_PUBLIC_TOKEN_CONTRACT_ADDRESS,
    verifierContract: process.env.REACT_APP_PUBLIC_VERIFIER_CONTRACT_ADDRESS,
    insuranceContract: process.env.REACT_APP_PUBLIC_INSURANCE_CONTRACT_ADDRESS,
    erc20Contract: process.env.REACT_APP_PUBLIC_USDT_CONTRACT_ADDRESS
}