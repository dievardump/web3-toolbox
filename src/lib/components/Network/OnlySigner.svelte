<script>
	import { signer, signerAddress } from '$lib/services/wallet';
	import Connect from './Connect.svelte';
	import OnlyConnected from './OnlyConnected.svelte';

	import OnlySupportedNetwork from './OnlySupportedNetwork.svelte';
</script>

{#if !$signer || !$signerAddress}
	<OnlyConnected>
		<div class="only-connected">
			<Connect />
		</div>
	</OnlyConnected>
{:else}
	<OnlySupportedNetwork>
		<slot />
	</OnlySupportedNetwork>
{/if}

<style lang="postcss">
	.only-connected {
		@apply flex flex-col items-center justify-center py-8 gap-8;
	}
</style>
