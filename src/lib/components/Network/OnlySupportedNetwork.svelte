<script>
	import { getNetwork } from '$lib/providers/networks';
	import { chainId } from '$lib/services/wallet';
</script>

{#if !getNetwork($chainId)}
	<div class="unknown">
		<h2>Unknown network.</h2>
		<p>Please change network on your wallet for Ethereum Mainnet</p>
	</div>
{:else}
	<slot />
{/if}

<style lang="postcss">
	.unknown {
		@apply text-center py-8;
	}
	p {
		@apply text-center py-4;
	}
</style>
