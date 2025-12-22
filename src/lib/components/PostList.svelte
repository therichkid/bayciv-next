<script lang="ts">
	import type { Custom_WP_REST_API_Posts } from '$lib/models/wordpress';
	import { getPosts, postState } from '$lib/post.svelte';
	import { onMount } from 'svelte';
	import PostCard from './PostCard.svelte';

	let posts = $state<Custom_WP_REST_API_Posts>([]);

	onMount(async () => {
		const response = await getPosts(1);
		posts = response.posts;
	});
</script>

<div class="my-6 w-full">
	{#if postState.isLoading}
		<p>Lade Neuigkeiten...</p>
	{:else if posts?.length}
		<div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each posts as post, i (post.id)}
				{#if i < 8}
					<PostCard {post} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
