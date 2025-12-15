import { SvelteDate, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Event_ACF } from './models/acf';
import type { WP_REST_API_Event, WP_REST_API_Events } from './models/wordpress';

export const eventState = $state<{ events: WP_REST_API_Events; isLoading: boolean }>({
	events: [],
	isLoading: false,
});

export const fetchEvents = async (from?: SvelteDate, to?: SvelteDate): Promise<WP_REST_API_Events> => {
	eventState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		_embed: 'true',
		from: from ? from.toISOString().split('T')[0] : '',
		to: to ? to.toISOString().split('T')[0] : '',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();

	const sortedEvents = data.sort((a: WP_REST_API_Event, b: WP_REST_API_Event) => {
		const dateA = new SvelteDate((a.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		const dateB = new SvelteDate((b.acf as WP_REST_API_Event_ACF).event_datum).getTime();
		return dateA - dateB;
	});

	eventState.events = sortedEvents;
	eventState.isLoading = false;

	return sortedEvents;
};
