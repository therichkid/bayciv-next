<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import type { WP_REST_API_Event } from '$lib/models/wordpress';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let value = $state(today(getLocalTimeZone()));
	let placeholder = $derived(new CalendarDate(data.year, data.month, 1));

	let lastRouted: string | null = null;
	$effect(() => {
		const { year, month } = placeholder;
		const next = `/events/${year}/${String(month).padStart(2, '0')}`;

		if (lastRouted === next) {
			return;
		}
		lastRouted = next;

		goto(resolve(next), { replaceState: true, keepFocus: true, noScroll: true });
	});

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
	bind:placeholder
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
