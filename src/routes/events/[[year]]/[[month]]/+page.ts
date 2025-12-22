import { getEvents } from '$lib/event.svelte';
import type { WP_REST_API_Event } from '$lib/models/wordpress';
import { endOfMonth, getLocalTimeZone, startOfMonth, today, type CalendarDate } from '@internationalized/date';
import { SvelteDate } from 'svelte/reactivity';
import type { PageLoad } from './$types';

function parseYearMonth(year?: string, month?: string): { from: CalendarDate; to: CalendarDate } {
	const now = today(getLocalTimeZone());

	const isValidYear = (y: number) => Number.isInteger(y) && y >= 1900 && y <= 2100;
	const isValidMonth = (m: number) => Number.isInteger(m) && m >= 1 && m <= 12;

	let yearNum = Number(year);
	let monthNum = Number(month);

	if (!isValidYear(yearNum)) yearNum = now.year;
	if (!isValidMonth(monthNum)) monthNum = now.month;

	const from = startOfMonth(now.set({ year: yearNum, month: monthNum }));
	const to = endOfMonth(from);

	return { from, to };
}

export const load: PageLoad = async ({ params }) => {
	const { from, to } = parseYearMonth(params.year, params.month);

	const events: WP_REST_API_Event[] = [];
	let page = 1;
	let totalPages: number;

	do {
		const response = await getEvents(new SvelteDate(from), new SvelteDate(to), page++);
		events.push(...response.events);
		totalPages = response.totalPages;
	} while (page <= (totalPages || 0));

	return {
		events: events,
		year: from.year,
		month: from.month,
	};
};
