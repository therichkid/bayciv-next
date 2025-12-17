<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let page = $derived(data.page);

	let pageContainer: HTMLDivElement | null = $state(null);
</script>

<svelte:head>
	<title>{page?.title.rendered ?? ''} - BayCIV</title>
</svelte:head>

<div class="max-w-3xl">
	{#if page}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{@html page.title.rendered}</h1>
		{#key page.content.rendered}
			<div class="prose-md max-w-3xl prose-a:text-primary prose-a:hover:underline" bind:this={pageContainer}>
				{@html page.content.rendered}
			</div>

			{#if page.acf.formular_id}
				<div class="mt-12">
					<Form formId={page.acf.formular_id} pageId={page.id} />
				</div>
			{/if}
			<div></div>
		{/key}
	{/if}
</div>

<ImageLightbox html={pageContainer} />
