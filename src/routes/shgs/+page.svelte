<script lang="ts">
	import BavariaGeoJson from '$lib/assets/bavaria.geo.json?raw';
	import ShgCard from '$lib/components/ShgCard.svelte';
	import TaxonomySelector from '$lib/components/TaxonomySelector.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import { Eraser, Search } from '@lucide/svelte';
	import { FillLayer, GeoJSON, LineLayer, MapLibre, Marker } from 'svelte-maplibre';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let shgs = $derived(data.shgs);

	let searchTerm = $state('');
	let selectedTermIds = $state<number[]>([]);
	let filteredShgs = $derived.by(() => {
		let filtered = shgs;

		if (searchTerm) {
			filtered = filtered.filter((shg) => shg.title.rendered.toLowerCase().includes(searchTerm.toLowerCase()));
		}

		if (selectedTermIds.length) {
			filtered = filtered.filter((shg) => {
				const assignedTermIds = shg.gruppenmerkmal || [];
				return selectedTermIds.every((selected) => assignedTermIds.includes(selected));
			});
		}

		return filtered;
	});

	let activeShg = $state<number | null>(null);

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
</script>

<div class="flex w-full flex-col gap-6 lg:h-[calc(100vh-256px)] lg:flex-row">
	<div class="flex h-full w-full flex-col">
		<div class="mb-8 px-2">
			<h1 class="my-6 text-lg font-semibold">{filteredShgs.length} Selbsthilfegruppen</h1>

			<InputGroup.Root class="mb-4 py-6 text-lg">
				<InputGroup.Input
					type="text"
					placeholder="Suche nach Selbsthilfegruppen..."
					autofocus
					bind:value={searchTerm}
				/>
				<InputGroup.Addon>
					<Search />
				</InputGroup.Addon>
				{#if searchTerm}
					<InputGroup.Addon align="inline-end">
						<InputGroup.Button onclick={() => (searchTerm = '')}>
							<Eraser />
						</InputGroup.Button>
					</InputGroup.Addon>
				{/if}
			</InputGroup.Root>

			<TaxonomySelector slug="gruppenmerkmal" bind:selectedTermIds />
		</div>

		<div
			class="grid grow grid-cols-1 gap-6 overflow-x-hidden p-2 lg:overflow-y-auto xl:grid-cols-2 min-[128rem]:grid-cols-3"
		>
			{#each filteredShgs as shg (shg.id)}
				<ShgCard {shg} onmouseenter={() => (activeShg = shg.id)} onmouseleave={() => (activeShg = null)} />
			{/each}
		</div>
	</div>

	<MapLibre
		center={centerOfBavaria}
		zoom={6.5}
		style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
		class="h-[calc(100vh-256px)] w-full rounded-lg lg:w-2/3"
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
