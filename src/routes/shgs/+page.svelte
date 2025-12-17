<script lang="ts">
	import type { WP_REST_API_SHG_ACF } from '$lib/models/acf';
	import type { WP_REST_API_SHG } from '$lib/models/wordpress';
	import { DefaultMarker, MapLibre } from 'svelte-maplibre';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
	let shgs = $derived(data.shgs) as (WP_REST_API_SHG & { acf: WP_REST_API_SHG_ACF })[];

	const centerOfBavaria: [number, number] = [11.431111, 48.7775];
</script>

<svelte:head>
	<title>Selbsthilfegruppen - BayCIV</title>
</svelte:head>

<MapLibre
	center={centerOfBavaria}
	zoom={6.5}
	style="https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json"
	class="h-200"
>
	{#each shgs as shg (shg.slug)}
		<DefaultMarker lngLat={[shg.acf.adresse?.lng, shg.acf.adresse?.lat]}></DefaultMarker>
	{/each}
</MapLibre>
