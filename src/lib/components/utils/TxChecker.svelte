<script>
	import { getNetwork } from '$lib/providers/networks';
	import { shortenAddress } from '$lib/utils';
	import { chainId } from '$lib/services/wallet';

	export let txHash;
</script>

{#if txHash}
	<p>
		Your transaction: <a
			href="{getNetwork($chainId).etherscan}/tx/{txHash}"
			target="_blank"
			rel="external noreferrer">{shortenAddress(txHash)}</a
		>
	</p>
{/if}

<style lang="postcss">
	p {
		@apply my-8;
		font-size: var(--font-s, 0.8);
	}

	a {
		text-decoration: underline;
	}
</style>
