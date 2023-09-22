<script>
	export let error;

	$: message = parseMessage(error);

	const SEARCH = 'Error: VM Exception while processing transaction: reverted with custom error';
	const ETHJS_QUERY = '[ethjs-query] while formatting outputs from RPC ';

	function parseMessage(error) {
		let message = 'An error occured';
		try {
			if (error) {
				if ('string' == typeof error.reason || 'string' == typeof error.message) {
					message = error.reason || error.message;
					if (error.message.indexOf(ETHJS_QUERY) == 0) {
						const json = error.message.replace(ETHJS_QUERY, '');
						const data = JSON.parse(json.substring(1, json.length - 1));
						message = data?.data?.message ?? data.value?.data?.message ?? v;
					}
				} else if (error?.data?.data && error.data.data.message.indexOf(SEARCH) != -1) {
					const reason = error.data.data.message.replace(SEARCH, '');
					message = reason ? `Transaction reverted with error: ${reason}` : message;
				} else {
					message =
						error.reason ?? error.message ?? error.data?.message ?? error.error ?? error ?? message;
				}
			}
		} catch (e) {
			console.log(e);
		}
		return message;
	}
</script>

{#if error}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<p on:click>
		<strong>An error occured!</strong><br />
		{message}
	</p>
	<slot />
{/if}

<style lang="postcss">
	p {
		@apply m-4;
		text-align: center;
		color: red;
		font-size: var(--font-xs);
	}
</style>
