<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WpEvent } from '$lib/event';

	export let wpEvent: WpEvent;
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="line-clamp-1">{wpEvent.title.rendered}</Card.Title>
		<Card.Description>
			{new Date(wpEvent.acf.event_datum).toLocaleDateString()} ({wpEvent.acf.zeit_von} - {wpEvent.acf.zeit_bis})
		</Card.Description>
	</Card.Header>

	<Card.Content>
		<p class="line-clamp-5">
			{@html wpEvent.excerpt.rendered}
		</p>
	</Card.Content>
</Card.Root>
