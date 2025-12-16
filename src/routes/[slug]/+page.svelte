<script lang="ts">
	import Form from '$lib/components/Form.svelte';
	import ImageLightbox from '$lib/components/ImageLightbox.svelte';
	import type { WP_REST_API_Page_ACF } from '$lib/models/acf';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let page = $derived(data.page);
	let acf = $derived(page.acf as WP_REST_API_Page_ACF);

	let pageContainer: HTMLDivElement | null = $state(null);
</script>

<div class="max-w-3xl">
	{#if page}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{@html page.title.rendered}</h1>
		{#key page.content.rendered}
			<div class="prose-md max-w-3xl" bind:this={pageContainer}>
				{@html page.content.rendered}
			</div>

			{#if acf.formular_id}
				<div class="mt-12">
					<Form formId={acf.formular_id} pageId={page.id} />
				</div>
			{/if}
			<div></div>
		{/key}
	{/if}
</div>

<ImageLightbox html={pageContainer} />
