<script lang="ts">
	import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import type { WP_REST_API_Event } from '$lib/models/wordpress';
	import { getLocalTimeZone, today } from '@internationalized/date';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let value = $state(today(getLocalTimeZone()));

	let { data }: PageProps = $props();
	let eventsPerDay = $derived.by(() => {
		const map = new SvelteMap<string, WP_REST_API_Event[]>();
		for (const event of data.events) {
			const date = new Date(event.acf.event_datum).toISOString().split('T')[0];
			if (!map.has(date)) {
				map.set(date, []);
			}
			map.get(date)?.push(event);
		}
		return map;
	});
</script>

<Calendar
	type="single"
	bind:value
	class="rounded-lg border shadow-sm [--cell-size:--spacing(18)]"
	captionLayout="label"
	locale="de"
>
	{#snippet day({ day, outsideMonth })}
		<CalendarDay class="flex flex-col items-center justify-start p-2">
			{day.day}

			{#if !outsideMonth && eventsPerDay.has(day.toString())}
				<span class="mt-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
					{eventsPerDay.get(day.toString())?.length} Events
				</span>
			{/if}
		</CalendarDay>
	{/snippet}
</Calendar>
