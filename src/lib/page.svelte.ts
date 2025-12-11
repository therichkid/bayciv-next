import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

export interface WpPage {
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

export const pageState = $state<{
	pagesBySlug: Record<string, WpPage>;
	isLoading: boolean;
}>({
	pagesBySlug: {},
	isLoading: false,
});

export const getPage = async (slug: string): Promise<WpPage | null> => {
	if (pageState.pagesBySlug[slug]) {
		return pageState.pagesBySlug[slug];
	}

	pageState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/wp/v2/pages`);
	const params = new SvelteURLSearchParams({
		slug,
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();
	const page = data[0] || null;

	if (page) {
		pageState.pagesBySlug[slug] = page;
	}
	pageState.isLoading = false;

	return page;
};
