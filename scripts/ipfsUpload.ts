import * as ipfsClient from 'ipfs-http-client';

const create: any = ipfsClient.create;
const client = create(`${process.env.IPFS_URL}`);

export const uploadToIpfs = async (image: any) => {

    if (image === null) {
        return;
    }
    try {
        const res = await client.add(image, {
            progress: (prog: any) => console.log(`received: ${prog}`),
        });

        return res.path;
    } catch (error) {
        console.log("Okoto");
    }
}