import * as moralis from "moralis";
import fs from "fs";
// import * as ipfsClient from "ipfs-http-client";
import * as dotenv from "dotenv";
const Moralis = moralis.default;

dotenv.config();
console.log(process.env.MORALIS_API_KEY);
// const create: any = ipfsClient.create;
// const client = create(`${process.env.IPFS_URL}`);


export const uploadToIpfs= async (content: any[], restart: boolean) => {
    if (restart) await Moralis.start({
        apiKey: process.env.MORALIS_API_KEY
    });

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: content
    })


    return response.result;


}

export const uploadImage = async (imagePath: string, restart: boolean, name: string, description: string, premiumPercentage: string) => {
    const file = fs.readFileSync(`/Users/ebube/Desktop/CodeWorks/Projects/de-insurance/images/${imagePath}`, {encoding: 'base64'});



    const data = {
        path: imagePath,
        content: file
    }

    console.log("Yoyo");
    const returnResponse = await uploadToIpfs([data], restart);
    console.log("Bye")

    const dataForJson = {
        name,
        description,
        premiumPercentage,
        img: returnResponse[0].path
    }

    return dataForJson;

}
