<script>
	import Button from '$lib/components/utils/Button.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { erc1155Snapshot, getContract, query } from '$lib/services/contracts';
	import { provider } from '$lib/services/wallet';

	export let contractAddress;

	const contract = getContract(contractAddress);

	let loading;
	let result;
	let formatted;

	let typeOfSnapshot = 1;
	let blockType = 1;
	let maxBlock = 0;

	let balanceForId = 1;

	$: formatResult(result, typeOfSnapshot, balanceForId);

	async function onSnapshot() {
		loading = true;
		result = null;

		let until = maxBlock;
		if (blockType == 1) {
			until = await $provider.getBlockNumber();
		}

		const { perWallet, perToken } = await erc1155Snapshot(contract, until, []);

		result = {
			perWallet,
			perToken
		};

		loading = false;
	}

	function formatResult(result) {
		formatted = '';
		if (!result) return;

		let data;

		if (typeOfSnapshot == 1) {
			data = Object.keys(result.perWallet);
		} else if (typeOfSnapshot == 2) {
			let temp = {};
			for (const key in result.perWallet) {
				temp[key] = {};
				for (const id in result.perWallet[key]) {
					temp[key][id] = result.perWallet[key][id].toNumber();
				}
			}

			data = temp;
		} else {
			data = result.perToken[balanceForId];
		}

		formatted = JSON.stringify(data, undefined, 2);
	}
</script>

<div class="form-line">
	<strong>Block Number</strong>
	<div class="form-line inputs">
		<label>
			<input type="radio" bind:group={blockType} name="blockType" value={1} />
			<span>All</span>
		</label>
		<label>
			<input type="radio" bind:group={blockType} name="blockType" value={2} />
			<span>At Block</span>
			<input type="number" disabled={blockType != 2} bind:value={maxBlock} />
		</label>
	</div>
</div>
{#if loading}
	<Loader />
{:else}
	<div class="form-line">
		<Button on:click={onSnapshot}>Snapshot!</Button>
	</div>
	{#if result}
		<div class="form-line">
			<strong>What type of snapshot do you want to do?</strong>
			<div class="form-line inputs">
				<label>
					<input type="radio" bind:group={typeOfSnapshot} name="typeOfSnapshot" value={1} />
					<span>Only addresses</span>
				</label>
				<label>
					<input type="radio" bind:group={typeOfSnapshot} name="typeOfSnapshot" value={2} />
					<span>Addresses and balance for all ids</span>
				</label>
				<label>
					<input type="radio" bind:group={typeOfSnapshot} name="typeOfSnapshot" value={3} />
					<span>Addresses for id:</span>
					<input type="number" bind:value={balanceForId} />
				</label>
			</div>
		</div>
		{#if formatted}
			<div class="result">
				<textarea disabled bind:value={formatted} />
			</div>
		{/if}
	{/if}
{/if}

<style lang="postcss">
	.inputs,
	label {
		@apply flex flex-row items-center gap-4;
	}

	label {
		@apply gap-2;
	}

	textarea {
		width: 100%;
		min-height: 300px;
	}

	.result {
		@apply mt-8;
	}
</style>
