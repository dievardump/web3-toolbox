<script>
	export let text = '';

	export let size = 80;
</script>

<div class="loading__wrapper">
	<svg
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		style="margin: auto; display: block;"
		width="{size}px"
		height="{size}px"
		viewBox="0 0 100 100"
		preserveAspectRatio="xMidYMid"
	>
		<path d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50" stroke="none">
			<animateTransform
				attributeName="transform"
				type="rotate"
				dur="1s"
				repeatCount="indefinite"
				keyTimes="0;1"
				values="0 50 51;360 50 51"
			/>
		</path>
	</svg>
	{#if $$slots}
		<slot />
	{:else if text}
		<p>{text}</p>
	{/if}
</div>

<style>
	.loading__wrapper {
		text-align: center;
		width: 100%;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	path {
		fill: var(--loader-color);
	}

	div {
		display: inline-block;
		position: relative;
	}

	p {
		text-align: center;
	}

	@keyframes lds-ring {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}
</style>
