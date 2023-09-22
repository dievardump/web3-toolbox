<script>
	import Button from '$lib/components/utils/Button.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { erc1155Snapshot, getContract, query } from '$lib/services/contracts';
	import { provider, signerAddress } from '$lib/services/wallet';
	import { isAddress, shortenAddress } from '$lib/utils';

	export let contractAddress;

	const contract = getContract(contractAddress);

	let loading = false;
	let accountFrom = $signerAddress;
	let recipient = '';
	let ids = '';
	let amounts = '';

	let fromLoading = false;
	let fromHoldings = [];

	$: accountFrom && (fromHoldings = []);

	$: canTransfer =
		isAddress(accountFrom) &&
		isAddress(recipient) &&
		ids.length >= 1 &&
		amounts.length >= 1 &&
		ids.split(',').length == amounts.split(',').length;

	async function onTransfer() {
		loading = true;

		const theIds = ids.split(',');
		const theAmounts = amounts.split(',');

		let tx;
		if (theIds.length == 1) {
			tx = await contract.safeTransferFrom(accountFrom, recipient, theIds[0], theAmounts[0], []);
		} else {
			tx = await contract.safeBatchTransferFrom(accountFrom, recipient, theIds, theAmounts, []);
		}

		await tx.wait();

		loading = false;
	}

	async function listFromHoldings() {
		fromLoading = true;

		const { perWallet } = await erc1155Snapshot(contract, await $provider.getBlockNumber(), []);

		const holdings = perWallet[accountFrom.toLowerCase()];

		fromHoldings = Object.keys(holdings).map((key) => {
			return `<strong>${key}</strong>:${holdings[key].toNumber()}`;
		});

		fromLoading = false;
	}
</script>

<div class="form-line">
	<div class="form-line">
		<label>
			<strong>From</strong>
			<input type="text" bind:value={accountFrom} placeholder="From address" />
		</label>
	</div>
	<div class="form-line">
		<label>
			<strong>Recipient</strong>
			<input type="text" bind:value={recipient} placeholder="Recipient address" />
		</label>
	</div>
	<div class="form-line">
		<label>
			<strong>IDs (separate with a ,)</strong>
			<input type="text" bind:value={ids} placeholder="List of IDs (separate with a ,)" />
		</label>
	</div>
	{#if accountFrom && isAddress(accountFrom)}
		<div class="form-line">
			<Button on:click={listFromHoldings}>list account ({shortenAddress(accountFrom)}) ids</Button>
		</div>
		{#if fromLoading}
			<Loader />
		{:else if fromHoldings.length}
			<div class="form-line">
				{@html fromHoldings.join(', ')}
			</div>
		{/if}
	{/if}
	<div class="form-line">
		<label>
			<strong>Amounts (separate with a ,)</strong>
			<input type="text" bind:value={amounts} placeholder="List of amounts (separate with a ,)" />
		</label>
	</div>
</div>
{#if loading}
	<Loader />
{:else}
	<div class="form-line">
		<Button disabled={!canTransfer} on:click={onTransfer}>Transfer!</Button>
	</div>
{/if}

<style lang="postcss">
</style>
