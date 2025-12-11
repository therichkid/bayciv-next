<script lang="ts">
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let articleContainer: HTMLDivElement | null = $state(null);
</script>

<div class="max-w-3xl">
	{#if data.post}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{data.post.title.rendered}</h1>
		<div class="prose-md prose max-w-3xl" bind:this={articleContainer}>
			{@html data.post.content.rendered}
		</div>
	{/if}
</div>

<ImageLightbox html={articleContainer} />
