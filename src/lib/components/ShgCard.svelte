<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WP_REST_API_SHG } from '$lib/models/wordpress';
	import { Baby, Globe, MapPin, Smile } from '@lucide/svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		shg: WP_REST_API_SHG;
	}

	let { shg, ...restProps }: Props = $props();

	let featuredMedia = $derived(shg._embedded?.['wp:featuredmedia']?.[0]);

	let imageObjectFitClass = $derived.by(() => {
		if (!featuredMedia?.media_details) {
			return 'object-cover';
		}

		const width = featuredMedia.media_details.width;
		const height = featuredMedia.media_details.height;
		const ratio = width / height;

		if (0.85 <= ratio && ratio <= 1.15) {
			return 'object-cover';
		} else {
			return 'object-contain';
		}
	});
</script>

<a href={resolve(`/shgs/${shg.slug}`)} {...restProps}>
	<Card.Root class="h-full max-h-64 p-0 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<Card.Content class="px-4 pt-3">
			<Card.Title title={shg.title.rendered} class="text-md mb-3 line-clamp-2 font-semibold">
				{@html shg.title.rendered}
			</Card.Title>

			<div class="flex gap-4">
				{#if featuredMedia}
					<img
						src={featuredMedia?.media_details?.sizes?.medium?.source_url || featuredMedia?.source_url}
						alt={`Logo der Selbsthilfegruppe ${shg.title.rendered}`}
						class="h-24 w-24 rounded-lg border {imageObjectFitClass}"
					/>
				{/if}

				<Card.Description class="text-sm text-muted-foreground">
					<div class="mb-6 flex w-full flex-wrap gap-2">
						{#if shg.acf.zielgruppe === 'Erwachsene'}
							<Badge class="bg-blue-100 py-1 text-blue-950">
								<Smile />
								Für Erwachsene
							</Badge>
						{/if}
						{#if shg.acf.zielgruppe === 'Kinder'}
							<Badge class="bg-pink-100 py-1 text-pink-950">
								<Baby />
								Für Kinder
							</Badge>
						{/if}
						{#if !shg.acf['online-gruppe']}
							<Badge class="bg-green-100 py-1 text-green-950">
								<MapPin />
								Trifft sich vor Ort
							</Badge>
						{/if}
						{#if shg.acf['online-gruppe']}
							<Badge class="bg-cyan-100 py-1 text-cyan-950">
								<Globe />
								Trifft sich online
							</Badge>
						{/if}
					</div>
				</Card.Description>
			</div>
		</Card.Content>

		<Card.Footer class="mt-auto p-4">
			<span class="ml-auto text-sm font-medium text-primary"> Zur Gruppenseite → </span>
		</Card.Footer>
	</Card.Root>
</a>
