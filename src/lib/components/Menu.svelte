<script>
	import { page } from '$app/stores';

	$: console.log($page.url.pathname);
</script>

<aside>
	<h2>Tools</h2>
	<ul>
		<li class:active={$page.url.pathname.includes('snapshots')}>
			<a href="/snapshots">Snapshots</a>
		</li>
		<li class:active={$page.url.pathname.includes('transfer')}><a href="/transfer">Transfer</a></li>
		<li class:active={$page.url.pathname.includes('metadata')}><a href="/metadata">Metadata</a></li>
	</ul>
</aside>

<style lang="postcss">
	aside {
		width: 240px;
		flex: 0 0 auto;
		background-color: var(--color-theme-2-1);
		color: var(--color-theme-3-1);
		box-shadow: 8px 0px 5px var(--color-theme-1-10);
	}

	h2 {
		@apply font-bold text-center p-4;
	}

	ul {
		@apply flex flex-col;
	}

	a {
		display: block;
		@apply py-4 px-2;
	}

	a:any-link {
		text-decoration: none;
	}

	li:hover {
		background-color: var(--color-theme-2-2);
	}

	li.active {
		background-color: var(--color-theme-2-3);
		color: var(--color-theme-3-2);
	}
</style>
