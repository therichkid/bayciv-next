<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Veranstaltungen - BayCIV</title>
</svelte:head>

<div class="w-full">
	{@render children()}
</div>
