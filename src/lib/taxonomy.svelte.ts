import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Term } from 'wp-types';

export const taxonomyState = $state<{
	taxonomyTermsBySlug: Record<string, WP_REST_API_Term[]>;
	isLoading: boolean;
}>({
	taxonomyTermsBySlug: {},
	isLoading: false,
});

export const getTaxonomyTerms = async (slug: string): Promise<WP_REST_API_Term[]> => {
	if (taxonomyState.taxonomyTermsBySlug[slug]) {
		return taxonomyState.taxonomyTermsBySlug[slug];
	}

	taxonomyState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/wp/v2/${slug}`);
	const params = new SvelteURLSearchParams({
		per_page: '20',
		orderby: 'count',
		order: 'desc',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const taxonomyTerms = await response.json();

	taxonomyState.taxonomyTermsBySlug[slug] = taxonomyTerms;
	taxonomyState.isLoading = false;

	return taxonomyTerms;
};
