<script>
	import Loader from '$lib/components/utils/Loader.svelte';
	import { getContract, query } from '$lib/services/contracts';
	import { onMount } from 'svelte';
	import MetadataReader from './MetadataReader.svelte';

	export let contractAddress;
	export let tokenId;

	let tokenURI;

	let loading;
	const contract = getContract(contractAddress);

	onMount(async () => {
		loading = true;
		tokenURI = await contract.tokenURI(tokenId);
		loading = false;
	});
</script>

{#if loading}
	<Loader />
{:else}
	<MetadataReader {tokenURI} />
{/if}

<style lang="postcss">
</style>
