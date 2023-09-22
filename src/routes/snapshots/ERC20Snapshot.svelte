<script>
	import Button from '$lib/components/utils/Button.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { getERC20Contract, query } from '$lib/services/contracts';
	import { provider } from '$lib/services/wallet';

	export let contractAddress;

	const contract = getERC20Contract(contractAddress);

	let loading;
	let result;
	let formatted;

	let typeOfSnapshot = 1;
	let blockType = 1;
	let maxBlock = 0;

	$: formatResult(result, typeOfSnapshot);

	async function onSnapshot() {
		loading = true;
		result = null;
		const filter = contract.filters.Transfer();

		let until = maxBlock;
		if (blockType == 1) {
			until = await $provider.getBlockNumber();
		}

		const logs = await query(contract, filter, 0, until);

		logs.sort((a, b) => {
			if (a.blockNumber !== b.blockNumber) {
				return a.blockNumber - b.blockNumber;
			}

			return a.logIndex - b.logIndex;
		});

		const perWallet = {};

		logs.forEach((log) => {
			const args = log.args;

			const from_ = args[0].toLowerCase();
			const to_ = args[1].toLowerCase();
			const value = args[2];

			if (!perWallet[from_]) {
				perWallet[from_] = ethers.BigNumber.from(0);
			}

			if (!perWallet[to_]) {
				perWallet[to_] = ethers.BigNumber.from(0);
			}

			perWallet[to_] = perWallet[to_].add(value);

			if (to_.toLowerCase().startsWith('0x3287')) {
				console.log(to_);
			}

			perWallet[from_] = perWallet[from_].sub(value);

			if (perWallet[from_].eq(ethers.BigNumber.from(0))) {
				delete perWallet[from_];
			}
		});

		//		delete perWallet[ethers.constants.AddressZero];

		result = {
			perWallet
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
			let temp = [];
			for (const key in result.perWallet) {
				temp.push({ key, value: result.perWallet[key] });
			}

			temp.sort((a, b) => (a.value.gte(b.value) ? -1 : 1));

			let temp2 = {};
			for (const _ of temp) {
				temp2[_.key] = _.value.toString();
			}

			data = temp2;
		}

		if (data) {
			formatted = JSON.stringify(data, undefined, 2);
		}
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
					<span>Address and balance</span>
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
