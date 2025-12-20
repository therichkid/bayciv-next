<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Selbsthilfegruppen - BayCIV</title>
</svelte:head>

<div class="w-full">
	{@render children()}
</div>
