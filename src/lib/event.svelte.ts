import { SvelteDate, SvelteMap, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Event_ACF } from './models/acf';
import type { WP_REST_API_Event, WP_REST_API_Events } from './models/wordpress';

type DateKey = string;
type PageNumber = number;

interface EventMeta {
	totalEvents: number;
	totalPages: number;
}

const PER_PAGE = 20;

export const eventState = $state<{
	byDate: SvelteMap<DateKey, { events: SvelteMap<PageNumber, WP_REST_API_Events> } & EventMeta>;
	isLoading: boolean;
}>({
	byDate: new SvelteMap(),
	isLoading: false,
});

export const getEvents = async (
	from?: SvelteDate,
	to?: SvelteDate,
	page = 1,
): Promise<{ events: WP_REST_API_Events } & EventMeta> => {
	const dateKey = getDateKey(from, to);

	let cache = eventState.byDate.get(dateKey);
	if (!cache) {
		cache = {
			events: new SvelteMap(),
			totalEvents: 0,
			totalPages: 0,
		};
		eventState.byDate.set(dateKey, cache);
	}

	if (cache.events.has(page)) {
		return {
			events: cache.events.get(page)!,
			totalEvents: cache.totalEvents,
			totalPages: cache.totalPages,
		};
	}

	eventState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
	const params = new SvelteURLSearchParams({
		per_page: PER_PAGE.toString(),
		page: page.toString(),
		_embed: 'true',
	});

	if (from) {
		params.set('from_date', from.toISOString().split('T')[0]);
	}
	if (to) {
		params.set('to_date', to.toISOString().split('T')[0]);
	}
	url.search = params.toString();

	const response = await fetch(url);

	const totalEvents = response.headers.get('X-WP-Total');
	const totalPages = response.headers.get('X-WP-TotalPages');

	const events = await response.json();
	const sortedEvents = events.sort((a: WP_REST_API_Event, b: WP_REST_API_Event) => {
		const dateA = new SvelteDate((a.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		const dateB = new SvelteDate((b.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		return dateA - dateB;
	});

	cache.events.set(page, sortedEvents);
	cache.totalEvents = totalEvents ? parseInt(totalEvents) : 0;
	cache.totalPages = totalPages ? parseInt(totalPages) : 0;

	eventState.isLoading = false;

	return {
		events: sortedEvents,
		totalEvents: cache.totalEvents,
		totalPages: cache.totalPages,
	};
};

const getDateKey = (from?: SvelteDate, to?: SvelteDate): string => {
	return `from=${from?.toISOString().split('T')[0] || ''}&to=${to?.toISOString().split('T')[0] || ''}`;
};
