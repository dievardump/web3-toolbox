<script>
	import Button from '$lib/components/utils/Button.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { getContract, query } from '$lib/services/contracts';
	import { provider, signerAddress } from '$lib/services/wallet';
	import { isAddress } from '$lib/utils';

	export let contractAddress;

	const contract = getContract(contractAddress);

	let loading = false;
	let accountFrom = $signerAddress;
	let recipient = '';
	let id = '';

	$: canTransfer = isAddress(accountFrom) && isAddress(recipient) && id.length >= 1;

	async function onTransfer() {
		loading = true;

		let tx = await contract.transferFrom(accountFrom, recipient, id);

		await tx.wait();

		loading = false;
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
			<strong>ID</strong>
			<input type="text" bind:value={id} placeholder="ID to transfer" />
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
