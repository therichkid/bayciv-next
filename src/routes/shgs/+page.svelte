<script lang="ts">
	import BavariaGeoJson from '$lib/assets/bavaria.geo.json?raw';
	import ShgCard from '$lib/components/ShgCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Input } from '$lib/components/ui/input';
	import { Baby, Globe, MapPin, Smile } from '@lucide/svelte';
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
	let activeShg = $state<number | null>(null);

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
</script>

<div class="flex h-[calc(100vh-256px)] w-full flex-col gap-6 lg:flex-row">
	<div class="flex h-full w-full flex-col">
		<div class="mb-8 px-2">
			<h1 class="my-6 text-lg font-semibold">{filteredShgs.length} Selbsthilfegruppen</h1>

			<Input
				type="text"
				placeholder="Suche nach Selbsthilfegruppen..."
				class="mb-4 py-6 text-lg"
				autofocus
				bind:value={searchTerm}
			/>

			<div class="flex w-full flex-wrap gap-2">
				<Badge class="bg-blue-100 py-1 text-blue-950">
					<Smile />
					Für Erwachsene
				</Badge>
				<Badge class="bg-pink-100 py-1 text-pink-950">
					<Baby />
					Für Kinder
				</Badge>
				<Badge class="bg-green-100 py-1 text-green-950">
					<MapPin />
					Trifft sich vor Ort
				</Badge>
				<Badge class="bg-cyan-100 py-1 text-cyan-950">
					<Globe />
					Trifft sich online
				</Badge>
			</div>
		</div>

		<div class="grid grow grid-cols-1 gap-6 p-2 lg:overflow-y-auto xl:grid-cols-2">
			{#each filteredShgs as shg (shg.id)}
				<ShgCard {shg} onmouseenter={() => (activeShg = shg.id)} onmouseleave={() => (activeShg = null)} />
			{/each}
		</div>
	</div>

	<MapLibre
		center={centerOfBavaria}
		zoom={6.5}
		style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
		class="h-[calc(100vh-256px)] w-full rounded-lg"
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
				<Marker
					lngLat={[shg.acf.adresse.lng, shg.acf.adresse.lat]}
					class="cursor-pointer hover:z-20 {activeShg === shg.id ? ' z-15' : 'z-10'}"
				>
					<div
						class="max-w-40 rounded-lg p-2 text-center shadow-lg transition-all duration-500 hover:max-w-80 hover:scale-[1.15] {activeShg ===
						shg.id
							? ' max-w-80 bg-primary text-white'
							: 'border bg-white'}"
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
