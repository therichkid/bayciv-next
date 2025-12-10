<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let articleContainer: HTMLDivElement | null = $state(null);

	let images: { elem: HTMLImageElement; index: number }[] = $state([]);
	let imagesInitialized: boolean = $state(false);
	let zoomedImage: { elem: HTMLImageElement; index: number } | null = $state(null);

	const setupImageHandlers = () => {
		if (imagesInitialized || !articleContainer) {
			return;
		}

		images = Array.from(articleContainer.querySelectorAll('img')).map((elem, index) => ({ elem, index }));

		images.forEach((image) => {
			image.elem.addEventListener('click', () => {
				zoomedImage = image;
			});

			image.elem.classList.add('cursor-pointer', 'transition', 'duration-300', 'hover:scale-[1.02]');
		});

		imagesInitialized = true;
	};

	$effect(() => {
		if (articleContainer) {
			setupImageHandlers();
		}
	});
</script>

<div class="max-w-3xl">
	{#if data.post}
		<h1 class="pt-12 pb-8 text-3xl font-semibold">{data.post.title.rendered}</h1>
		<div class="prose-md prose max-w-3xl" bind:this={articleContainer}>{@html data.post.content.rendered}</div>
	{/if}
</div>

<Dialog.Root
	open={zoomedImage !== null}
	onOpenChange={(open) => {
		if (!open) {
			// Wait for the dialog close animation to finish
			setTimeout(() => (zoomedImage = null), 100);
		}
	}}
>
	<Dialog.Content class="align-center flex max-h-[90vh] justify-center p-8 sm:max-w-fit">
		{#if zoomedImage}
			<img
				srcset={zoomedImage.elem.srcset}
				src={zoomedImage.elem.src}
				alt={zoomedImage.elem.alt}
				class="object-contain"
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
