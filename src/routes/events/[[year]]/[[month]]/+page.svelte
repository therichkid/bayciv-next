<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { Calendar } from '$lib/components/ui/calendar';
	import CalendarDay from '$lib/components/ui/calendar/calendar-day.svelte';
	import { getEvents } from '$lib/event.svelte';
	import type { WP_REST_API_Event, WP_REST_API_Events } from '$lib/models/wordpress';
	import { CalendarDate, getLocalTimeZone, today } from '@internationalized/date';
	import { SvelteDate, SvelteMap } from 'svelte/reactivity';
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let events = $state<WP_REST_API_Events>([]);

	$effect(() => {
		events = [...data.initialEvents];

		if (data.totalPages > 1) {
			loadRemainingPages();
		}
	});

	const loadRemainingPages = async () => {
		for (let page = 2; page <= data.totalPages; page++) {
			const batch = await getEvents(new SvelteDate(data.from), new SvelteDate(data.to), page);
			events.push(...batch.events);
		}
	};

	let eventsPerDay = $derived.by(() => {
		const map = new SvelteMap<string, WP_REST_API_Event[]>();
		for (const event of events) {
			const date = new Date(event.acf.event_datum).toISOString().split('T')[0];
			if (!map.has(date)) {
				map.set(date, []);
			}
			map.get(date)?.push(event);
		}
		return map;
	});

	let value = $state(today(getLocalTimeZone()));
	let placeholder = $derived(new CalendarDate(data.from.year, data.from.month, 1));

	$effect(() => {
		placeholder = new CalendarDate(data.from.year, data.from.month, 1);
	});

	$effect(() => {
		const { year, month } = placeholder;

		const href = resolve('/events/[[year]]/[[month]]', {
			year: String(year),
			month: String(month).padStart(2, '0'),
		});

		if (window.location.pathname === href) {
			return;
		}

		goto(href, { replaceState: true, keepFocus: true, noScroll: true });
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
		<CalendarDay
			class="flex flex-col items-center justify-start p-2 data-selected:bg-primary/10! data-selected:text-primary! data-selected:ring-2 data-selected:ring-primary/50"
		>
			{day.day}

			{#if !outsideMonth && eventsPerDay.has(day.toString())}
				<span class="mt-1 rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary">
					{eventsPerDay.get(day.toString())?.length} Events
				</span>
			{/if}
		</CalendarDay>
	{/snippet}
</Calendar>
