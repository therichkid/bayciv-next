<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { eventState, fetchEvents } from '$lib/event.svelte';
	import type { WP_REST_API_Event } from '$lib/models/wordpress';
	import { onMount } from 'svelte';
	import { SvelteDate } from 'svelte/reactivity';
	import EventCard from './EventCard.svelte';

	let events = $state<WP_REST_API_Event[]>([]);

	onMount(async () => {
		events = await fetchEvents(new SvelteDate());
	});
</script>

<div class="my-6 w-full">
	{#if eventState.isLoading}
		<p>Lade Events...</p>
	{:else if events.length}
		<Carousel.Root
			opts={{
				align: 'start',
			}}
			class="max-w-sm  md:max-w-2xl lg:max-w-4xl xl:max-w-6xl"
		>
			<Carousel.Content>
				{#each events as event (event.id)}
					<Carousel.Item class="pl-6 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
						<EventCard {event} />
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous class="cursor-pointer" />
			<Carousel.Next class="cursor-pointer" />
		</Carousel.Root>
	{/if}
</div>
