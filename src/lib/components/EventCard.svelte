<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WP_REST_API_Event_ACF } from '$lib/models/acf';
	import type { WP_REST_API_Embedded, WP_REST_API_Event } from '$lib/models/wordpress';
	import { Clock, MapPin, Users } from '@lucide/svelte';

	let { event }: { event: WP_REST_API_Event } = $props();

	const embedded = $derived(event._embedded as WP_REST_API_Embedded);
	const acf = $derived(event.acf as WP_REST_API_Event_ACF);
</script>

<a href={resolve(`/events/${event.slug}`)}>
	<Card.Root class="h-full p-0 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<div class="relative h-40 w-full overflow-hidden rounded-t-lg">
			<div class="pointer-events-none absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"></div>
			<div class="absolute top-5 left-5 z-10">
				<p class="text-5xl font-bold tracking-tight text-secondary">{new Date(acf.event_datum).getDate()}.</p>
				<p class=" text-2xl font-bold tracking-tight text-secondary">
					{new Date(acf.event_datum).toLocaleString(undefined, { month: 'short' })}
				</p>
				{#if new Date(acf.event_datum).getFullYear() !== new Date().getFullYear()}
					<p class=" text-lg font-semibold tracking-tight text-secondary">
						{new Date(acf.event_datum).getFullYear()}
					</p>
				{/if}
			</div>

			<img src="https://picsum.photos/300/200?random{event.id}" alt="Lorem Picsum" class="h-full w-full object-cover" />
		</div>

		<Card.Header>
			<Card.Title class="line-clamp-2 text-lg font-semibold">{@html event.title.rendered}</Card.Title>
		</Card.Header>

		<Card.Content>
			{#if embedded?.['wp:term']?.[0]?.[0]?.name}
				<p class="my-2 flex items-center gap-2 text-sm text-muted-foreground">
					<Users size={24} class="shrink-0" />
					<span>{embedded['wp:term'][0][0].name ?? ''}</span>
				</p>
			{/if}
			<p class="my-2 flex items-center gap-2 text-sm text-muted-foreground">
				<Clock size={24} class="shrink-0" />
				<span>{acf.zeit_von}</span>
				{#if acf.zeit_bis}
					<span> - {acf.zeit_bis}</span>
				{/if}
			</p>
			<p class="my-2 flex items-center gap-2 text-sm text-muted-foreground">
				<MapPin size={24} class="shrink-0" />
				<span>
					{#if acf.adresse}
						{acf.adresse.street_name ?? ''}
						{acf.adresse.street_number ?? ''}, {acf.adresse.post_code}
						{acf.adresse.city}
					{:else}
						{acf.adressname}
					{/if}
				</span>
			</p>
		</Card.Content>

		<Card.Footer class="mt-auto p-4">
			<span class="ml-auto text-sm font-medium text-primary"> Mehr Infos → </span>
		</Card.Footer>
	</Card.Root>
</a>
