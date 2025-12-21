<script lang="ts">
	import { Marker } from 'svelte-maplibre';

	interface Props {
		userLocation: [number, number];
	}

	let { userLocation }: Props = $props();
</script>

<Marker lngLat={userLocation}>
	<div class="pointer-events-none relative h-10 w-10 -translate-x-1/2 -translate-y-1/2">
		<div class="absolute inset-0 animate-ping rounded-full bg-blue-600/25"></div>
		<div
			class="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 ring-10 ring-blue-200/80"
		></div>
	</div>
</Marker>
