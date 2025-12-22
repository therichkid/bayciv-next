import { getEvents } from '$lib/event.svelte';
import { endOfMonth, getLocalTimeZone, parseDate, startOfMonth, today } from '@internationalized/date';
import { SvelteDate } from 'svelte/reactivity';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url }) => {
	const fromParam = url.searchParams.get('from');
	const defaultFrom = startOfMonth(today(getLocalTimeZone()));

	let fromDate = defaultFrom;
	if (fromParam) {
		try {
			fromDate = parseDate(fromParam);
		} catch {
			fromDate = defaultFrom;
		}
	}

	const rangeStart = startOfMonth(fromDate);
	const rangeEnd = endOfMonth(fromDate);

	const events = [];
	let eventsPerPage = [];
	let page = 1;

	do {
		eventsPerPage = await getEvents(new SvelteDate(rangeStart), new SvelteDate(rangeEnd), page++);
		events.push(...eventsPerPage);
	} while (eventsPerPage.length === 10);

	return { events, from: rangeStart.toString() };
};
