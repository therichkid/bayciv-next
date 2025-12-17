<script lang="ts">
	import EventCarousel from '$lib/components/EventCarousel.svelte';
	import PostList from '$lib/components/PostList.svelte';
</script>

<svelte:head>
	<title>Home - BayCIV</title>
</svelte:head>

<h2 class="pt-12 pb-8 text-3xl font-semibold">Neuigkeiten</h2>
<PostList />

<h2 class="pt-12 pb-8 text-3xl font-semibold">Veranstaltungen</h2>
<EventCarousel />
