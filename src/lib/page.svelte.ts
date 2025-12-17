import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { Custom_WP_REST_API_Page } from './models/wordpress';

export const pageState = $state<{
	pagesBySlug: Record<string, Custom_WP_REST_API_Page>;
	isLoading: boolean;
}>({
	pagesBySlug: {},
	isLoading: false,
});

export const getPage = async (slug: string): Promise<Custom_WP_REST_API_Page | null> => {
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
