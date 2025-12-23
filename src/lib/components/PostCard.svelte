<script lang="ts">
	import { resolve } from '$app/paths';
	import * as Card from '$lib/components/ui/card';
	import type { Custom_WP_REST_API_Post } from '$lib/models/wordpress';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	interface Props extends HTMLAnchorAttributes {
		post: Custom_WP_REST_API_Post;
	}

	let { post }: Props = $props();

	let featuredMedia = $derived(post._embedded?.['wp:featuredmedia']?.[0]);
</script>

<a href={resolve(`/news/${post.slug}`)}>
	<Card.Root class="h-full p-0 transition duration-300 hover:scale-[1.02] hover:shadow-lg">
		<div class="h-48 w-full overflow-hidden rounded-t-lg">
			<img
				src={featuredMedia?.media_details?.sizes?.medium?.source_url || featuredMedia?.source_url}
				alt={featuredMedia?.alt_text || featuredMedia?.caption.rendered || post.title.rendered}
				class="h-full w-full object-cover"
			/>
		</div>

		<Card.Content class="px-4">
			<Card.Title title={post.title.rendered} class="mb-2 line-clamp-2 text-lg font-semibold">
				{@html post.title.rendered}
			</Card.Title>

			<Card.Description class="line-clamp-5 text-sm text-muted-foreground">
				{@html post.excerpt.rendered}
			</Card.Description>
		</Card.Content>

		<Card.Footer class="mt-auto p-4">
			<span class="ml-auto text-sm font-medium text-primary"> Weiterlesen → </span>
		</Card.Footer>
	</Card.Root>
</a>
