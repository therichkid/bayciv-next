import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { Custom_WP_REST_API_Page } from './models/wordpress';

export const pageState = $state<{
	bySlug: Record<string, Custom_WP_REST_API_Page>;
	isLoading: boolean;
}>({
	bySlug: {},
	isLoading: false,
});

export const getPage = async (slug: string): Promise<Custom_WP_REST_API_Page | null> => {
	if (pageState.bySlug[slug]) {
		return pageState.bySlug[slug];
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
		pageState.bySlug[slug] = page;
	}
	pageState.isLoading = false;

	return page;
};
