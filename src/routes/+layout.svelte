<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import BayCivBanner from '$lib/components/images/BayCivBanner.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<BayCivBanner />

<header class="sticky top-0 z-50 flex w-full items-center bg-background">
	<Navigation />
</header>

<div class="mx-auto min-h-screen max-w-6xl px-12 py-6">
	{@render children()}
</div>
