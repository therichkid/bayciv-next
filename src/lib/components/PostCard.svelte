<script lang="ts">
	import * as Card from '$lib/components/ui/card/index.js';
	import type { WpPost } from '$lib/post.svelte';

	export let post: WpPost;
</script>

<Card.Root class="p-0 transition-shadow duration-300 hover:shadow-lg">
	<div class="h-48 w-full overflow-hidden rounded-t-lg">
		<img
			src={post._embedded?.['wp:featuredmedia']?.[0].source_url}
			alt={post._embedded?.['wp:featuredmedia']?.[0].alt_text ||
				post._embedded?.['wp:featuredmedia']?.[0].caption ||
				post.title.rendered}
			class="h-full w-full object-cover"
		/>
	</div>

	<Card.Content class="px-4">
		<Card.Title class="mb-2 line-clamp-2 text-lg font-semibold">
			{post.title.rendered}
		</Card.Title>

		<Card.Description class="line-clamp-5 text-sm text-muted-foreground">
			{@html post.excerpt.rendered}
		</Card.Description>
	</Card.Content>

	<Card.Footer class="p-4 pt-0">
		<span class="text-sm font-medium text-primary"> Weiterlesen → </span>
	</Card.Footer>
</Card.Root>
