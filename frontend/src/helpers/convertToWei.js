

const convertToWei = (web3, price) => {
	if (web3) {
		return web3.utils.toWei(price, 'ether');
	}
};

export default convertToWei;
