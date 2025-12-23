import { getEvents } from '$lib/event.svelte';
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

	const firstBatch = await getEvents(new SvelteDate(from), new SvelteDate(to), 1);

	return {
		initialEvents: firstBatch.events,
		totalPages: firstBatch.totalPages,
		from,
		to,
	};
};
