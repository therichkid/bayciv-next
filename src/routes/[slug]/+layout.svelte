<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<title>Selbsthilfegruppen - BayCIV</title>
</svelte:head>

<div class="max-w-3xl">
	{@render children()}
</div>
