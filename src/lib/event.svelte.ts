import { SvelteDate, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

export interface WpEvent {
	id: number;
	link: string;
	title: {
		rendered: string;
	};
	excerpt: {
		rendered: string;
	};
	content: {
		rendered: string;
	};
	acf: {
		event_datum: string;
		zeit_von: string;
		zeit_bis: string;
	};
}

export const eventState = $state<{ events: WpEvent[]; isLoading: boolean }>({
	events: [],
	isLoading: false,
});

export const fetchEvents = async (): Promise<WpEvent[]> => {
	eventState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/events');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		meta_key: 'event_datum',
		meta_value: new SvelteDate().toISOString().split('T')[0],
		meta_compare: '>=',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();

	const sortedEvents = data.sort((a: WpEvent, b: WpEvent) => {
		const dateA = new SvelteDate(a.acf.event_datum).getTime();
		const dateB = new SvelteDate(b.acf.event_datum).getTime();
		return dateA - dateB;
	});

	eventState.events = sortedEvents;
	eventState.isLoading = false;

	return sortedEvents;
};
