export function debounce(func, wait = 100) {
	let timeout;
	return function (...args) {
		clearTimeout(timeout);
		timeout = setTimeout(() => {
			func.apply(this, args);
		}, wait);
	};
}

export function shortenAddress(str) {
	return shorten(str, 6, 3).toLocaleLowerCase();
}

export function shorten(str, lengthStart, lengthEnd = 0) {
	str = str.toString ? str.toString() : str;
	if (str.length <= lengthStart + lengthEnd) return str;

	console.log(lengthStart + lengthEnd);
	return str.substr(0, lengthStart) + '...' + (lengthEnd ? str.substr(-lengthEnd) : '');
}

export function isAddress(str) {
	return /0x[a-f0-9]{40}/.test(str.toLocaleLowerCase());
}

export function link(str) {
	return str
		.replace('ar://', 'https://arweave.net/')
		.replace('ipfs://ipfs/', 'ipfs://')
		.replace('ipfs://', 'https://ipfs.io/ipfs/');
}
