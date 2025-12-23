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
		return [...events]
			.sort(
				(a, b) =>
					new Date(`${a.acf.event_datum} ${a.acf.zeit_von}`).getTime() -
					new Date(`${b.acf.event_datum} ${b.acf.zeit_von}`).getTime(),
			)
			.reduce((map, event) => {
				const date = event.acf.event_datum;
				if (!map.has(date)) {
					map.set(date, []);
				}
				map.get(date)?.push(event);
				return map;
			}, new SvelteMap<string, WP_REST_API_Event[]>());
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

<div class="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
	<div>
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
					class="flex flex-col items-center justify-start p-2 data-selected:bg-primary/10! data-selected:text-primary! data-selected:ring-2 data-selected:ring-primary"
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
	</div>

	<aside class="rounded-lg border shadow-sm xl:col-span-2">
		<div class="border-b px-4 py-5">
			<h1 class="mb-5 text-lg font-semibold">Veranstaltungen</h1>
			<p class="text-xs text-muted-foreground">
				{events.length} Veranstaltungen im {new Date().toLocaleString(undefined, {
					month: 'long',
					year: 'numeric',
				})}.
			</p>
		</div>

		<div class="max-h-[70vh] overflow-auto px-4 py-5">
			<ol class="space-y-6">
				{#each eventsPerDay.entries() as [day, events] (day)}
					<li class="rounded-md border p-3">
						<div class="flex items-center justify-between">
							<div>
								<span class="text-3xl font-bold tracking-tight text-primary">
									{new Date(day).getDate()}.
								</span>
								<span class=" text-xl font-bold tracking-tight text-primary">
									{new Date(day).toLocaleString(undefined, { month: 'short' })}
								</span>
							</div>
							<div class="text-xs text-muted-foreground">
								{events.length} Veranstaltung{events.length === 1 ? '' : 'en'}
							</div>
						</div>

						<div class="mt-3 space-y-3">
							{#each events as event (event.id)}
								<div class="flex items-center gap-2">
									<div class="h-2 w-2 rounded-full bg-primary/60"></div>
									<div>
										<p class="text-sm font-medium">{@html event.title.rendered}</p>
										<p class="text-xs text-muted-foreground">
											{event.acf.zeit_von}
											{#if event.acf.zeit_bis}
												- {event.acf.zeit_bis}
											{/if}
										</p>
									</div>
								</div>
							{/each}
						</div>
					</li>
				{/each}
			</ol>
		</div>
	</aside>
</div>
