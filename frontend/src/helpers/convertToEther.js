

const convertToEther = (web3, price) => {
	if (web3) {
		return web3.utils.fromWei(price, 'ether');
	}
};

export default convertToEther;
