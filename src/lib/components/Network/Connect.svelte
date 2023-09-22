<script>
	import Button from '$lib/components/utils/Button.svelte';
	import { connectAccount } from '$lib/services/wallet';

	async function onConnect() {
		await connectAccount();
	}
</script>

<div class="connect">
	<p>This website needs access to the chain to be able to query events / interact</p>
	<Button props={{ rounded: true }} on:click={onConnect}>Connect Wallet</Button>
</div>

<style lang="postcss">
	.connect {
		@apply flex flex-col items-center justify-center gap-8;
	}
</style>
