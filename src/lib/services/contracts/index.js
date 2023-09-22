import { getNetwork } from '$lib/providers/networks';
import { getChainId, getSignerOrProvider } from '../wallet';
import ABI from './abi.json' assert { type: 'json' };
import ERC20ABI from './erc20-abi.json' assert { type: 'json' };

export function getContract(collection) {
	return new ethers.Contract(collection, ABI, getSignerOrProvider());
}

export function getERC20Contract(collection) {
	return new ethers.Contract(collection, ERC20ABI, getSignerOrProvider());
}

export async function ownerOf(collection, tokenId) {
	const contract = getContract(collection);

	try {
		return await contract.ownerOf(tokenId);
	} catch (e) {}

	try {
		return await contract.punkIndexToAddress(tokenId);
	} catch (e) {}

	throw new Error('Does this token exist?');
}

export function getNFTContract() {
	return getContract(getNetwork(getChainId()).Verified);
}

export function getMinter() {
	return getContract(getNetwork(getChainId()).VerifiedMinter);
}

export function getMetadata() {
	return getContract(getNetwork(getChainId()).VerifiedMetadata);
}

export function verifiedExists(collection, tokenId) {
	const contract = getContract(getNetwork(getChainId()).VerifiedDataHolder);

	return contract.getOriginTokenVerifiedId(collection, tokenId);
}

export async function renderImage(colors, grid, cols, encode) {
	return await getMetadata().render(colors, grid, cols, encode);
}

export async function totalSupply() {
	return await getNFTContract()
		.totalSupply()
		.then((res) => res.toNumber());
}

export async function tokenURI(tokenId) {
	return await getNFTContract()
		.tokenURI(tokenId)
		.then((res) => fetch(res))
		.then((res) => res.json());
}

export async function query(contract, filter, fromBlock, toBlock) {
	console.log('querying...', fromBlock, '...', toBlock);
	try {
		return await contract.queryFilter(filter, fromBlock, toBlock);
	} catch (e) {
		const step = ~~((toBlock - fromBlock) / 2);
		const middle = fromBlock + step;
		return [
			...(await query(contract, filter, fromBlock, middle)),
			...(await query(contract, filter, middle + 1, toBlock))
		];
	}
}

export async function erc1155Snapshot(contract, until, filters = []) {
	const filterSingle = contract.filters.TransferSingle(...filters);
	const filterBatch = contract.filters.TransferBatch(...filters);

	const logs = [
		...(await query(contract, filterSingle, 0, until)),
		...(await query(contract, filterBatch, 0, until))
	];

	logs.sort((a, b) => {
		if (a.blockNumber !== b.blockNumber) {
			return a.blockNumber - b.blockNumber;
		}

		return a.logIndex - b.logIndex;
	});

	const perWallet = {};
	const perToken = {};

	logs.forEach((log) => {
		const args = log.args;

		const operator_ = args[0].toLowerCase();
		const from_ = args[1].toLowerCase();
		const to_ = args[2].toLowerCase();

		const ids = log.event == 'TransferSingle' ? [args[3]] : args[3];
		const values = log.event == 'TransferSingle' ? [args[4]] : args[4];

		for (let i = 0; i < ids.length; i++) {
			const id_ = ids[i].toNumber();
			const value_ = values[i];

			if (value_.toNumber() == 0) {
				return;
			}

			if (!perWallet[from_]) {
				perWallet[from_] = {};
			}

			if (!perWallet[from_][id_]) {
				perWallet[from_][id_] = ethers.BigNumber.from(0);
			}

			if (!perWallet[to_]) {
				perWallet[to_] = {};
			}

			if (!perWallet[to_][id_]) {
				perWallet[to_][id_] = ethers.BigNumber.from(0);
			}

			perToken[id_] = perToken[id_] || [];
			// add to to perToken if current balance is 0
			if (perWallet[to_][id_].toNumber() == 0) {
				perToken[id_].push(to_);
			}

			perWallet[to_][id_] = perWallet[to_][id_].add(value_);
			perWallet[from_][id_] = perWallet[from_][id_].sub(value_);

			// if from wallet has now 0
			if (perWallet[from_][id_].toNumber() == 0) {
				// remove from from perToken[id_]
				perToken[id_].splice(perToken[id_].indexOf(from_), 1);

				// delet id from this wallet
				delete perWallet[from_][id_];

				// and if it was the last id owned, remove wallet
				if (Object.keys(perWallet[from_]).length == 0) {
					delete perWallet[from_];
				}
			}
		}
	});

	delete perWallet[ethers.constants.AddressZero];

	return { perWallet, perToken };
}

export async function erc721Snapshot(contract, until, filters = []) {
	const filter = contract.filters.Transfer(...filters);
	const logs = await query(contract, filter, 0, until);

	logs.sort((a, b) => {
		if (a.blockNumber !== b.blockNumber) {
			return a.blockNumber - b.blockNumber;
		}

		return a.logIndex - b.logIndex;
	});

	const perWallet = {};
	const perToken = {};

	logs.forEach((log) => {
		const args = log.args;

		const from_ = args[0].toLowerCase();
		const to_ = args[1].toLowerCase();
		const id = args[2].toNumber();

		if (!perWallet[from_]) {
			perWallet[from_] = [];
		}

		if (!perWallet[to_]) {
			perWallet[to_] = [];
		}

		perWallet[to_].push(id);

		perToken[id] = to_;

		perWallet[from_].splice(perWallet[from_].indexOf(id), 1);

		if (perWallet[from_].length == 0) {
			delete perWallet[from_];
		}
	});

	delete perWallet[ethers.constants.AddressZero];

	return {
		perWallet,
		perToken
	};
}
