<script>
	import ErrorComponent from '$lib/components/utils/ErrorComponent.svelte';
	import { link } from '$lib/utils';
	import { onMount } from 'svelte';

	export let tokenURI;

	let metadata;
	let error;

	let attributes = [];

	onMount(async () => {
		try {
			metadata = await fetch(link(tokenURI)).then((res) => res.json());
			attributes = metadata.attributes || [];
		} catch (e) {
			error = e;
		}
	});
</script>

<div class="data">
	<div class="line">
		<div class="label">tokenURI</div>
		<div class="data">{tokenURI}</div>
	</div>
	{#if metadata}
		<div class="line">
			<div class="label">Name</div>
			<div class="data">{metadata.name}</div>
		</div>

		<div class="line">
			<div class="label">Description</div>
			<div class="data">{metadata.description}</div>
		</div>
		<div class="line">
			<div class="label">Raw Image URI</div>
			<div class="data">
				{metadata.image}
			</div>
		</div>
		<div class="line">
			<div class="label">Image URI</div>
			<div class="data">
				{link(metadata.image)}
			</div>
		</div>
		<div class="line">
			<div class="label">Image</div>
			<div class="data"><img src={link(metadata.image)} alt={metadata.name} /></div>
		</div>
		{#if attributes.length}
			<div class="line">
				<div class="label">Attributes</div>
				<div class="data">
					{#each attributes as attribute}
						<p>
							<strong>{attribute.trait_type}</strong>: {attribute.value}
						</p>
					{/each}
				</div>
			</div>
		{/if}
	{/if}
</div>

<ErrorComponent {error} />

<style lang="postcss">
	.line {
		@apply grid grid-cols-4 mt-2;
	}

	.line .label {
		@apply col-span-1 font-bold;
	}

	.line .data {
		@apply col-span-3;
	}
</style>
