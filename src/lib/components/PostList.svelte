<script lang="ts">
	import { getPosts, postState } from '$lib/post.svelte';
	import { onMount } from 'svelte';
	import PostCard from './PostCard.svelte';

	onMount(() => {
		getPosts(1);
	});
</script>

<div class="my-6 w-full">
	{#if postState.isLoading}
		<p>Lade Neuigkeiten...</p>
	{:else if postState.postsByPage[1]?.length}
		<div class="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
			{#each postState.postsByPage[1] as post, i (post.id)}
				{#if i < 8}
					<PostCard {post} />
				{/if}
			{/each}
		</div>
	{/if}
</div>
