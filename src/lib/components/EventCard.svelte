<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WpEvent } from '$lib/event.svelte';

	export let event: WpEvent;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="line-clamp-1">{event.title.rendered}</Card.Title>
		<Card.Description>
			{new Date(event.acf.event_datum).toLocaleDateString()} ({event.acf.zeit_von} - {event.acf.zeit_bis})
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<p class="line-clamp-5">
			{@html event.excerpt.rendered}
		</p>
	</Card.Content>
</Card.Root>
