const Moralis = require("moralis").default;


const uploadToIpfs= async (content) => {
    await Moralis.start({
        apiKey: process.env.REACT_APP_PUBLIC_MORALIS_API_KEY
    });

    const response = await Moralis.EvmApi.ipfs.uploadFolder({
        abi: content
    })


    return response.result;


}

export default uploadToIpfs;
 






