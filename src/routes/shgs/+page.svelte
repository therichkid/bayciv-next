<script lang="ts">
	import BavariaGeoJson from '$lib/assets/bavaria.geo.json?raw';
	import { Input } from '$lib/components/ui/input';
	import { FillLayer, GeoJSON, LineLayer, MapLibre, Marker } from 'svelte-maplibre';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let shgs = $derived(data.shgs);

	let searchTerm = $state('');
	let filteredShgs = $derived.by(() => {
		if (!searchTerm) {
			return shgs;
		}

		return shgs.filter((shg) => shg.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()));
	});

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
</script>

<div class="grid w-full grid-cols-1 gap-8 md:grid-cols-2">
	<div>
		<h1 class="pt-6 pb-6 text-lg font-semibold">{filteredShgs.length} Selbsthilfegruppen</h1>

		<Input type="text" placeholder="Suche nach Selbsthilfegruppen..." class="mb-4 w-full" bind:value={searchTerm} />
	</div>
	<MapLibre
		center={centerOfBavaria}
		zoom={6.5}
		style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
		class="h-200 w-full rounded-lg"
	>
		<GeoJSON id="bavaria-boundary" data={JSON.parse(BavariaGeoJson)}>
			<LineLayer
				layout={{ 'line-cap': 'round', 'line-join': 'round' }}
				paint={{ 'line-color': '#3a2e87', 'line-width': 2 }}
			/>
			<FillLayer
				paint={{
					'fill-color': '#3a2e87',
					'fill-opacity': 0.02,
				}}
			/>
		</GeoJSON>
		{#each filteredShgs as shg (shg.slug)}
			{#if shg.acf.adresse}
				<Marker lngLat={[shg.acf.adresse.lng, shg.acf.adresse.lat]} class="z-10 cursor-pointer hover:z-20">
					<div
						class="max-w-40 rounded-lg border bg-white px-2 py-2 text-center opacity-90 shadow-lg transition-transform duration-300 hover:max-w-full hover:scale-[1.15] hover:opacity-100"
					>
						<span class="line-clamp-1 text-xs font-semibold">
							{@html shg.title.rendered}
						</span>
					</div>
				</Marker>
			{/if}
		{/each}
	</MapLibre>
</div>
