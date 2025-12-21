<script lang="ts">
	import { resolve } from '$app/paths';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { TAXONOMY_DISPLAY_MAP } from '$lib/constants/taxonomy';
	import type { WP_REST_API_SHG } from '$lib/models/wordpress';
	import { getAddressString } from '$lib/utils/address';
	import { decrypt } from '$lib/utils/crypt';
	import { getRandomTailwindColor } from '$lib/utils/random';
	import { Mail, MapPin, Navigation, Phone } from '@lucide/svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		shg: WP_REST_API_SHG & { distanceInMeters?: number };
	}

	let { shg, ...restProps }: Props = $props();

	let featuredMedia = $derived(shg._embedded?.['wp:featuredmedia']?.[0]);
	let termGroups = $derived(shg._embedded?.['wp:term'] || []);

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
	<Card.Root class="h-full max-h-96 py-4 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<Card.Header>
			<Card.Title title={shg.title.rendered} class="text-md line-clamp-2 font-semibold">
				{@html shg.title.rendered}
			</Card.Title>
		</Card.Header>

		<Card.Content>
			<div class="flex gap-4">
				{#if featuredMedia}
					<img
						src={featuredMedia?.media_details?.sizes?.medium?.source_url || featuredMedia?.source_url}
						alt={`Logo der Selbsthilfegruppe ${shg.title.rendered}`}
						class="h-24 w-24 rounded-lg border {imageObjectFitClass}"
					/>
				{/if}

				<Card.Description class="text-sm text-muted-foreground">
					<div class="mb-4 flex w-full flex-wrap gap-2">
						{#each termGroups as termGroup, i (i)}
							{#each termGroup as term (term.id)}
								{#if term.taxonomy === 'gruppenmerkmal'}
									{@const color =
										TAXONOMY_DISPLAY_MAP['gruppenmerkmal']?.[term.slug]?.color || getRandomTailwindColor(term.slug)}
									{@const IconComponent = TAXONOMY_DISPLAY_MAP['gruppenmerkmal']?.[term.slug]?.icon}

									<Badge class="bg-{color}-100 py-1 text-{color}-950">
										{#if IconComponent}
											<IconComponent />
										{/if}
										{term.name}
									</Badge>
								{/if}
							{/each}
						{/each}
					</div>

					<div>
						{#if shg.distanceInMeters}
							<p class="my-3 flex items-center gap-2">
								<Navigation size={22} class="shrink-0" />
								<span>{Math.round(shg.distanceInMeters / 1000)} km entfernt</span>
							</p>
						{/if}
						<p class="my-3 flex items-center gap-2">
							<MapPin size={22} class="shrink-0" />
							<span class="line-clamp-4">
								{getAddressString(shg.acf.adresse, shg.acf.adressname)}
							</span>
						</p>
						{#if shg.acf.email}
							<p class="my-3 flex items-center gap-2">
								<Mail size={22} class="shrink-0" />
								<span>{decrypt(shg.acf.email)}</span>
							</p>
						{/if}
						{#if shg.acf.telefon}
							<p class="my-3 flex items-center gap-2">
								<Phone size={22} class="shrink-0" />
								<span>{shg.acf.telefon}</span>
							</p>
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
