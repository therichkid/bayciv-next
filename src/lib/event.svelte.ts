import { SvelteDate, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

export interface WpEvent {
	id: number;
	slug: string;
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
		adresse: {
			address: string;
			lat: { source: string; parsedValue: number };
			lng: { source: string; parsedValue: number };
			street_number: string;
			street_name: string;
			city: string;
			state: string;
			state_short: string;
			post_code: string;
			country: string;
			country_short: string;
		};
	};
	_embedded?: {
		author: {
			id: number;
			name: string;
			slug: string;
		}[];
		'wp:featuredmedia'?: {
			source_url: string;
			caption: string;
			alt_text?: string;
			media_details?: {
				sizes?: {
					thumbnail?: { source_url: string };
					medium?: { source_url: string };
					medium_large?: { source_url: string };
					full?: { source_url: string };
				};
			};
		}[];
		'wp:term'?: {
			id: number;
			name: string;
			slug: string;
			taxonomy: 'category';
		}[][];
	};
}

export const eventState = $state<{ events: WpEvent[]; isLoading: boolean }>({
	events: [],
	isLoading: false,
});

export const fetchEvents = async (): Promise<WpEvent[]> => {
	eventState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/custom/v1/events');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		_embed: 'true',
		from: new SvelteDate().toISOString().split('T')[0],
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
