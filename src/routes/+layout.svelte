<script>
	import Menu from '$lib/components/Menu.svelte';
	import { init } from '$lib/services/wallet';
	import { onMount } from 'svelte';
	import Header from './Header.svelte';
	import './styles.css';

	onMount(() => {
		init(ethers, false);
	});
</script>

<div class="app">
	<Menu />
	<div class="app-content">
		<Header />
		<main>
			<slot />
		</main>

		<footer>
			<a href="https://twitter.com/dievardump" target="_blank" rel="noreferrer">
				made with ♥ by @dievardump
			</a>
		</footer>
	</div>
</div>

<style lang="postcss">
	.app {
		@apply flex;
		min-height: 100vh;
	}

	.app-content {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		flex: 1 1 0;
	}

	main {
		flex: 1;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		width: 100%;
		max-width: 64rem;
		margin: 0 auto;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	footer a {
		font-style: italic;
	}

	@media (min-width: 480px) {
		footer {
			padding: 12px 0;
		}
	}
</style>
