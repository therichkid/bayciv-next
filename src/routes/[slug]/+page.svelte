<script lang="ts">
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let pageContainer: HTMLDivElement | null = $state(null);
</script>

<div class="max-w-3xl">
	{#if data.page}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{@html data.page.title.rendered}</h1>
		{#key data.page.content.rendered}
			<div class="prose-md max-w-3xl" bind:this={pageContainer}>
				{@html data.page.content.rendered}
			</div>
		{/key}
	{/if}
</div>

<ImageLightbox html={pageContainer} />
