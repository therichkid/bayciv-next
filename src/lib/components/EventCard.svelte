<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import type { WP_REST_API_Event } from '$lib/models/wordpress';
	import { getAddressString } from '$lib/utils/address';
	import { getGroupNames } from '$lib/utils/shg';
	import { Clock, MapPin, Users } from '@lucide/svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		event: WP_REST_API_Event;
	}

	let { event }: Props = $props();
</script>

<a href={resolve(`/events/${event.slug}`)}>
	<Card.Root class="h-full p-0 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<div class="relative h-40 w-full overflow-hidden rounded-t-lg">
			<div class="pointer-events-none absolute inset-0 bg-linear-to-r from-black/80 via-black/40 to-transparent"></div>
			<div class="absolute top-5 left-5 z-10">
				<p class="text-5xl font-bold tracking-tight text-secondary">{new Date(event.acf.event_datum).getDate()}.</p>
				<p class=" text-2xl font-bold tracking-tight text-secondary">
					{new Date(event.acf.event_datum).toLocaleString(undefined, { month: 'short' })}
				</p>
				{#if new Date(event.acf.event_datum).getFullYear() !== new Date().getFullYear()}
					<p class=" text-lg font-semibold tracking-tight text-secondary">
						{new Date(event.acf.event_datum).getFullYear()}
					</p>
				{/if}
			</div>

			<img src="https://picsum.photos/300/200?random{event.id}" alt="Lorem Picsum" class="h-full w-full object-cover" />
		</div>

		<Card.Header>
			<Card.Title title={event.title.rendered} class="line-clamp-2 text-lg font-semibold">
				{@html event.title.rendered}
			</Card.Title>
		</Card.Header>

		<Card.Content class="text-sm text-muted-foreground">
			{@const groupNames = getGroupNames(event._embedded?.['wp:term'])}
			{#if groupNames.length > 0}
				<p class="my-3 flex items-center gap-2">
					<Users size={22} class="shrink-0" />
					<span>{groupNames.join(', ')}</span>
				</p>
			{/if}
			<p class="my-3 flex items-center gap-2">
				<Clock size={22} class="shrink-0" />
				<span>{event.acf.zeit_von}</span>
				{#if event.acf.zeit_bis}
					<span> - {event.acf.zeit_bis}</span>
				{/if}
			</p>
			<p class="my-3 flex items-center gap-2">
				<MapPin size={24} class="shrink-0" />
				<span>
					{getAddressString(event.acf.adresse, event.acf.adressname)}
				</span>
			</p>
		</Card.Content>

		<Card.Footer class="mt-auto p-4">
			<span class="ml-auto text-sm font-medium text-primary"> Mehr Infos → </span>
		</Card.Footer>
	</Card.Root>
</a>
