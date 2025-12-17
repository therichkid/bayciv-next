<script lang="ts">
	import { MapLibre, Marker } from 'svelte-maplibre';
	import type { PageProps } from './$types';

	const stockImages = import.meta.glob('$lib/assets/stock/thumbnail/*.webp', {
		eager: true,
		query: '?url',
		import: 'default',
	});
	const stockImageUrls = Object.values(stockImages) as string[];

	let { data }: PageProps = $props();
	let shgs = $derived(data.shgs);

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
</script>

<svelte:head>
	<title>Selbsthilfegruppen - BayCIV</title>
</svelte:head>

<MapLibre
	center={centerOfBavaria}
	zoom={6.5}
	standardControls
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	class="h-200"
>
	{#each shgs as shg, i (shg.slug)}
		{#if shg.acf.adresse}
			<Marker lngLat={[shg.acf.adresse.lng, shg.acf.adresse.lat]} class="z-10 cursor-pointer hover:z-20">
				<div class=" flex flex-col items-center transition-transform duration-300 hover:scale-[1.15]">
					<img
						src={shg._embedded?.['wp:featuredmedia']?.[0]?.media_details?.sizes?.thumbnail?.source_url ||
							shg._embedded?.['wp:featuredmedia']?.[0]?.source_url ||
							stockImageUrls[i % stockImageUrls.length]}
						alt={shg.title.rendered}
						class="h-16 w-16 rounded-full border-4 border-white bg-white object-cover shadow-lg"
					/>
					<div class="mt-2 max-w-40 rounded bg-white px-2 py-1 text-center opacity-85 shadow-lg">
						<span class="line-clamp-1 text-xs font-semibold">
							{@html shg.title.rendered}
						</span>
					</div>
				</div>
			</Marker>
		{/if}
	{/each}
</MapLibre>
