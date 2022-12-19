import * as moralis from "moralis";
const Moralis = moralis.default;

Moralis.start({
    apiKey: process.env.REACT_APP_PUBLIC_MORALIS_API_KEY
});

const uploadToIpfs= async (content) => {
    console.log("Hey boss")

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: content
    })

    console.log("Here now");
    return response.result;


}

export default uploadToIpfs;
 






