<script>
	import OnlyConnected from '$lib/components/Network/OnlyConnected.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { getContract } from '$lib/services/contracts';
	import { debounce } from '$lib/utils';
	import Erc1155Transfer from './ERC1155Transfer.svelte';
	import Erc721Transfer from './ERC721Transfer.svelte';

	let contractAddress = '';

	let isERC1155 = false;
	let isERC721 = false;

	let loading = false;

	$: check(contractAddress);

	const check = debounce(async (address) => {
		isERC721 = false;
		isERC1155 = false;
		address = address.toLowerCase();
		loading = true;
		try {
			if (/0x[a-f0-9]{40}/.test(address)) {
				const contract = getContract(address);
				isERC721 = await contract.supportsInterface('0x80ac58cd');
				isERC1155 = await contract.supportsInterface('0xd9b67a26');

				console.log(isERC1155, isERC721);
			}
		} catch (e) {}
		loading = false;
	}, 250);
</script>

<section>
	<h2>Transfers</h2>
	<OnlyConnected>
		<form>
			<div class="form-line">
				<label>
					<strong>Contract address</strong>
					<input type="text" bind:value={contractAddress} placeholder="Contract address " />
				</label>
			</div>
			<hr />
			{#if loading}
				<Loader />
			{:else if isERC721}
				<strong>ERC721 contract detected.</strong>
				<Erc721Transfer {contractAddress} />
			{:else if isERC1155}
				<strong>ERC1155 contract detected.</strong>
				<Erc1155Transfer {contractAddress} />
			{:else}
				<div class="form-line text-center">
					<strong>Please select an ERC721 or ERC1155 contract.</strong>
				</div>
			{/if}
		</form>
	</OnlyConnected>
</section>
