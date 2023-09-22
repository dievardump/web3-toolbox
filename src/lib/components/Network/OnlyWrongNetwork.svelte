<script>
	import { chainId } from '$lib/services/wallet';
	import env from '$lib/services/env';

	$: intChain = parseInt($chainId);
</script>

{#if env.VITE_FORCE_CHAIN_ID != '0' && intChain && intChain != env.VITE_FORCE_CHAIN_ID}
	<slot />
{/if}
