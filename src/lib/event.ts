import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

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

export const fetchEvents = async (): Promise<WpEvent[]> => {
	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/events');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		meta_key: 'event_datum',
		meta_value: new Date().toISOString().split('T')[0],
		meta_compare: '>=',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();

	return data.sort((a: WpEvent, b: WpEvent) => {
		const dateA = new Date(a.acf.event_datum).getTime();
		const dateB = new Date(b.acf.event_datum).getTime();
		return dateA - dateB;
	});
};
