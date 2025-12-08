<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import BayCivBanner from '$lib/components/BayCivBanner.svelte';
	import Navigation from '$lib/components/Navigation.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import './layout.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher />

<BayCivBanner />

<header class="sticky top-0 z-50 flex w-full items-center justify-center bg-background">
	<Navigation />
</header>

<div class="mx-auto h-[200vh] max-w-6xl px-12 py-6">
	{@render children()}
</div>
