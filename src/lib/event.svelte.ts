import { SvelteDate, SvelteMap, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Event_ACF } from './models/acf';
import type { WP_REST_API_Event, WP_REST_API_Events } from './models/wordpress';

type EventKey = [string | undefined, string | undefined, number];

export const eventState = $state<{
	eventsByDate: SvelteMap<EventKey, WP_REST_API_Events>;
	isLoading: boolean;
}>({
	eventsByDate: new SvelteMap(),
	isLoading: false,
});

export const getEvents = async (from?: SvelteDate, to?: SvelteDate, page = 1): Promise<WP_REST_API_Events> => {
	if (eventState.eventsByDate.has(eventKey(from, to, page))) {
		return eventState.eventsByDate.get(eventKey(from, to, page))!;
	}

	eventState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		page: page.toString(),
		_embed: 'true',
	});
	if (from) params.set('from_date', from.toISOString().split('T')[0]);
	if (to) params.set('to_date', to.toISOString().split('T')[0]);
	url.search = params.toString();

	const response = await fetch(url);
	const events = await response.json();

	const sortedEvents = events.sort((a: WP_REST_API_Event, b: WP_REST_API_Event) => {
		const dateA = new SvelteDate((a.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		const dateB = new SvelteDate((b.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		return dateA - dateB;
	});

	eventState.eventsByDate.set(eventKey(from, to, page), sortedEvents);
	eventState.isLoading = false;

	return sortedEvents;
};

const eventKey = (from: SvelteDate | undefined, to: SvelteDate | undefined, page: number): EventKey => {
	return [from?.toISOString().split('T')[0], to?.toISOString().split('T')[0], page];
};
