<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import BayCivBanner from '$lib/components/images/BayCivBanner.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>BayCIV</title>
</svelte:head>

<Toaster />

<BayCivBanner />

<header class="sticky top-0 z-50 flex w-full items-center bg-background">
	<Navigation />
</header>

<div class="flex justify-center px-12 py-6">
	{@render children()}
</div>
