<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog/index.js';

	interface LightboxImage {
		elem: HTMLImageElement;
		index: number;
		handler: ((event: MouseEvent) => void) | null;
	}

	let { html }: { html: HTMLDivElement | null } = $props();

	let images: LightboxImage[] = [];
	let zoomedImage: LightboxImage | null = $state(null);

	const setupImageHandlers = () => {
		console.log('triggered');

		if (!html) {
			return;
		}

		images = Array.from(html.querySelectorAll('img')).map((elem, index) => ({ elem, index, handler: null }));

		images.forEach((image) => {
			if (image.handler) {
				return;
			}

			const handler = (_event: MouseEvent) => (zoomedImage = image);
			image.elem.addEventListener('click', handler);
			image.handler = handler;

			image.elem.classList.add('rounded-sm', 'cursor-pointer', 'transition', 'duration-300', 'hover:scale-[1.02]');
		});
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
