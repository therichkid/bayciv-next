<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WpEvent } from '$lib/event.svelte';

	let { event }: { event: WpEvent } = $props();
</script>

<Card.Root class="transition-shadow duration-300 hover:shadow-lg">
	<Card.Header>
		<Card.Title class="line-clamp-2 text-lg font-semibold">{event.title.rendered}</Card.Title>
		<Card.Description class="text-sm text-foreground">
			{new Date(event.acf.event_datum).toLocaleDateString()} ({event.acf.zeit_von} - {event.acf.zeit_bis})
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<p class="line-clamp-5 text-sm text-muted-foreground">
			{@html event.excerpt.rendered}
		</p>
	</Card.Content>
</Card.Root>
