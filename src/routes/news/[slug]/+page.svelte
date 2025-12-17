<script lang="ts">
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let post = $derived(data.post);

	let articleContainer: HTMLDivElement | null = $state(null);
</script>

<svelte:head>
	<title>{post?.title.rendered ?? ''} - BayCIV</title>
</svelte:head>

<div class="max-w-3xl">
	{#if data.post}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{@html data.post.title.rendered}</h1>
		{#key data.post.content.rendered}
			<div class="prose-md prose max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={articleContainer}>
				{@html data.post.content.rendered}
			</div>
		{/key}
	{/if}
</div>

<ImageLightbox html={articleContainer} />
