<script lang="ts">
	import { fetchPosts, postState } from '$lib/post.svelte';
	import { onMount } from 'svelte';
	import PostCard from './PostCard.svelte';

	onMount(() => {
		if (postState.posts.length === 0) {
			fetchPosts();
		}
	});
</script>

<div class="my-6 w-full">
	{#if postState.isLoading}
		<p>Lade Neuigkeiten...</p>
	{:else if postState.posts.length}
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each postState.posts as post, i (post.id)}
				{#if i < 8}
					<PostCard {post} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
