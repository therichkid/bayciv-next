<script lang="ts">
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { fetchEvents, type WpEvent } from '$lib/event';
	import EventCard from './EventCard.svelte';

	let wpEvents: WpEvent[] = [];
	fetchEvents().then((events) => {
		wpEvents = events;
	});
</script>

<div class="my-6 flex w-full items-center justify-center">
	{#if wpEvents.length}
		<Carousel.Root
			opts={{
				align: 'start',
			}}
			class="w-full max-w-7xl"
		>
			<Carousel.Content>
				{#each wpEvents as wpEvent, i (i)}
					<Carousel.Item class="md:basis-1/2 lg:basis-1/3">
						<div class="p-1">
							<EventCard {wpEvent} />
						</div>
					</Carousel.Item>
				{/each}
			</Carousel.Content>
			<Carousel.Previous />
			<Carousel.Next />
		</Carousel.Root>
	{/if}
</div>
