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

{#if post}
	<h1 class="pt-12 pb-8 text-3xl font-semibold">{@html post.title.rendered}</h1>
	{#key post.content.rendered}
		<div class="prose-md prose max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={articleContainer}>
			{@html post.content.rendered}
		</div>
	{/key}
{/if}

<ImageLightbox html={articleContainer} />
