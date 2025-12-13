import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Page } from 'wp-types';

export const pageState = $state<{
	pagesBySlug: Record<string, WP_REST_API_Page>;
	isLoading: boolean;
}>({
	pagesBySlug: {},
	isLoading: false,
});

export const getPage = async (slug: string): Promise<WP_REST_API_Page | null> => {
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
