<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	let { html }: { html: HTMLDivElement | null } = $props();

	let images: { elem: HTMLImageElement; index: number }[] = $state([]);
	let imagesInitialized: boolean = $state(false);
	let zoomedImage: { elem: HTMLImageElement; index: number } | null = $state(null);

	const setupImageHandlers = () => {
		if (imagesInitialized || !html) {
			return;
		}

		images = Array.from(html.querySelectorAll('img')).map((elem, index) => ({ elem, index }));

		images.forEach((image) => {
			image.elem.addEventListener('click', () => {
				zoomedImage = image;
			});

			image.elem.classList.add('rounded-sm', 'cursor-pointer', 'transition', 'duration-300', 'hover:scale-[1.02]');
		});

		imagesInitialized = true;
	};

	$effect(() => {
		if (html) {
			setupImageHandlers();
		}
	});
</script>

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
				class="rounded-md object-contain"
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
