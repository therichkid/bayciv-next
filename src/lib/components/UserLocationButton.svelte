<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Target } from '@lucide/svelte';

	interface Props {
		location: [number, number] | null;
		onLocationChange?: (location: [number, number]) => void;
	}

	let { location = $bindable(), onLocationChange = () => {} }: Props = $props();

	let locating = $state<boolean>(false);
	let locationError = $state<string | null>(null);

	const locateUser = () => {
		locationError = null;

		if (!navigator.geolocation) {
			locationError = 'Dein Browser unterstützt keine Geolokalisierung.';
			return;
		}

		locating = true;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const lng = position.coords.longitude;
				const lat = position.coords.latitude;

				location = [lng, lat];
				onLocationChange(location);

				locating = false;
			},
			(error) => {
				switch (error.code) {
					case error.PERMISSION_DENIED:
						locationError = 'Standortzugriff verweigert. Bitte erlaube den Zugriff auf deinen Standort.';
						break;
					case error.POSITION_UNAVAILABLE:
						locationError = 'Standortinformationen sind nicht verfügbar.';
						break;
					case error.TIMEOUT:
						locationError = 'Zeitüberschreitung bei der Standortanfrage.';
						break;
					default:
						locationError = 'Ein unbekannter Fehler ist aufgetreten.';
						break;
				}

				locating = false;
			},
		);
	};
</script>

{#if 'geolocation' in navigator}
	<div class="flex flex-col items-end">
		<Button variant="outline" class="py-2" onclick={locateUser} disabled={locating}>
			<Target />
			<span class="ml-2">In meiner Nähe</span>
		</Button>

		{#if locationError}
			<p class="mt-2 text-end text-sm text-red-600">{locationError}</p>
		{/if}
	</div>
{/if}
