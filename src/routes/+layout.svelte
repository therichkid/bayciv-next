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

<div class="flex max-h-32 w-full items-center justify-center overflow-hidden">
	<BayCivBanner />
</div>
<header class="sticky top-0 z-50 flex w-full items-center justify-center bg-background">
	<Navigation />
</header>

<div class="h-[200vh]">
	{@render children()}
</div>
