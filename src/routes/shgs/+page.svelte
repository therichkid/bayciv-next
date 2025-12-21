<script lang="ts">
	import BavariaGeoJson from '$lib/assets/bavaria.geo.json?raw';
	import ShgCard from '$lib/components/ShgCard.svelte';
	import TaxonomySelector from '$lib/components/TaxonomySelector.svelte';
	import * as InputGroup from '$lib/components/ui/input-group/index.js';
	import UserLocationButton from '$lib/components/UserLocationButton.svelte';
	import UserLocationMarker from '$lib/components/UserLocationMarker.svelte';
	import type { WP_REST_API_SHG } from '$lib/models/wordpress';
	import { Eraser, Search } from '@lucide/svelte';
	import { LngLat } from 'maplibre-gl';
	import { FillLayer, GeoJSON, LineLayer, MapLibre, Marker, Popup, type Map } from 'svelte-maplibre';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let shgs = $derived(data.shgs);

	let map: Map | undefined = $state(undefined);

	let searchTerm = $state('');
	let selectedTermIds = $state<number[]>([]);
	let filteredShgs: (WP_REST_API_SHG & { distanceInMeters?: number })[] = $derived.by(() => {
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

		if (userLocation) {
			const from = new LngLat(userLocation[0], userLocation[1]);

			filtered = filtered
				.map((shg) => {
					if (shg.acf.adresse && shg.acf.adresse.lat && shg.acf.adresse.lng) {
						const to = new LngLat(shg.acf.adresse.lng, shg.acf.adresse.lat);
						return { ...shg, distanceInMeters: from.distanceTo(to) };
					}
					return { ...shg, distanceInMeters: undefined };
				})
				.sort((a, b) => {
					if (a.distanceInMeters === undefined && b.distanceInMeters === undefined) return 0;
					if (a.distanceInMeters === undefined) return 1;
					if (b.distanceInMeters === undefined) return -1;
					return a.distanceInMeters - b.distanceInMeters;
				});
		}

		return filtered;
	});

	let activeShg = $state<number | null>(null);

	let userLocation: [number, number] | null = $state(null);

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
	const bavariaBounds: [[number, number], [number, number]] = [
		[5, 44],
		[18, 54],
	];
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

			<div class="flex items-center justify-between">
				<TaxonomySelector slug="gruppenmerkmal" bind:selectedTermIds />

				<UserLocationButton
					bind:location={userLocation}
					onLocationChange={(location) => map?.flyTo({ center: location, zoom: 10, essential: true })}
				/>
			</div>
		</div>

		<div
			class="grid grow grid-cols-1 gap-6 overflow-x-hidden p-2 lg:overflow-y-auto xl:grid-cols-2 min-[128rem]:grid-cols-3"
		>
			{#each filteredShgs as shg (shg.id)}
				<ShgCard
					{shg}
					onclick={() => {
						if (shg.acf.adresse && shg.acf.adresse.lng && shg.acf.adresse.lat) {
							map?.flyTo({ center: [shg.acf.adresse.lng, shg.acf.adresse.lat], essential: true });
						}
					}}
					onmouseenter={() => (activeShg = shg.id)}
					onmouseleave={() => (activeShg = null)}
				/>
			{/each}
		</div>
	</div>

	<MapLibre
		bind:map
		center={centerOfBavaria}
		maxBounds={bavariaBounds}
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

		{#if userLocation}
			<UserLocationMarker {userLocation} />
		{/if}

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

					<Popup offset={[0, -20]}>
						<ShgCard {shg} class="max-w-150 animate-none" />
					</Popup>
				</Marker>
			{/if}
		{/each}
	</MapLibre>
</div>
