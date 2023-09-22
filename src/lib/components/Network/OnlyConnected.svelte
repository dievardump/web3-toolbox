<script>
	import { chainId, checkedWallet, connected, hasWallet } from '$lib/services/wallet';
	// import { connectWeb3Modal } from '$lib/services/web3Modal';
	import Button from '$lib/components/utils/Button.svelte';
	import Connect from './Connect.svelte';
	import Loader from '../utils/Loader.svelte';

	import OnlySupportedNetwork from './OnlySupportedNetwork.svelte';

	// async function webModal() {
	// 	await connectWeb3Modal();
	// }
</script>

{#if !$checkedWallet}
	<div class="loader__wrapper">
		<Loader text="Checking wallet..." />
	</div>
{:else if !$connected}
	<div class="only-connected">
		{#if $hasWallet}
			<div class="buttons">
				<Connect />
			</div>
		{:else}
			<slot name="only-connected">
				<p class="small">
					This website is optimized to work with decentralized web3 browser wallet (like MetaMask,
					Tally Oh! or CoinBase).
				</p>
				<p class="small">If you already have one, make sure that it's unlocked.</p>
				<div class="buttons">
					<Button
						href="https://metamask.app.link/dapp/etherealstates.art"
						props={{ target: '_blank', rel: 'noreferrer' }}>Download MetaMask</Button
					>
					<Button href="https://tally.cash/">Download Tally Oh!</Button>
				</div>
				<p class="small">
					ps: if you have several wallets (MetaMask & CoinBase for example), <br />make sure to not
					have both activated at the same time.
					<a
						href="https://github.com/MetaMask/metamask-extension/issues/13622"
						target="_blank"
						rel="noreferrer">They can conflict</a
					>.
				</p>
				<!-- <div class="buttons">
					<Button on:click={webModal}>Connect with another wallet</Button>
				</div> -->
			</slot>
		{/if}
	</div>
{:else}
	<OnlySupportedNetwork>
		<slot />
	</OnlySupportedNetwork>
{/if}

<style lang="postcss">
	.only-connected {
		@apply flex flex-col items-center justify-center gap-8 text-center;
	}

	.buttons {
		@apply flex flex-row gap-8 items-center justify-center;
	}

	.loader__wrapper {
		@apply my-16;
	}
</style>
