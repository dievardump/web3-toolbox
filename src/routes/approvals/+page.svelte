<script>
	import { browser } from '$app/environment';
	import OnlyConnected from '$lib/components/Network/OnlyConnected.svelte';
	import Button from '$lib/components/utils/Button.svelte';
	import Loader from '$lib/components/utils/Loader.svelte';
	import { getContract } from '$lib/services/contracts';

	let contractAddress = '';
	let approvedAddress = '';

	$: valid = browser && check(contractAddress, approvedAddress);

	function check(contractAddress, approvedAddress) {
		return ethers.utils.isAddress(contractAddress) && ethers.utils.isAddress(approvedAddress);
	}

	async function onApprove() {
		await getContract(contractAddress).setApprovalForAll(approvedAddress, true);
	}
</script>

<section>
	<h2>Approvals</h2>
	<OnlyConnected>
		<form>
			<div class="form-line">
				<label>
					<strong>Collection address</strong>
					<input
						type="text"
						bind:value={contractAddress}
						placeholder="Collection contract address "
					/>
				</label>
				<label>
					<strong>Approved address</strong>
					<input
						type="text"
						bind:value={approvedAddress}
						placeholder="Approved contract address "
					/>
				</label>
			</div>
			<hr />
			<Button disabled={!valid} on:click={onApprove}>Approve</Button>
		</form>
	</OnlyConnected>
</section>
