import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_SHG, WP_REST_API_SHGs } from './models/wordpress';

const PER_PAGE = 100;

export const shgState = $state<{
	shgs: WP_REST_API_SHGs;
	bySlug: Record<string, WP_REST_API_SHG>;
	isLoading: boolean;
}>({
	shgs: [],
	bySlug: {},
	isLoading: false,
});

export const getShgs = async (): Promise<WP_REST_API_SHGs> => {
	if (shgState.shgs.length) {
		return shgState.shgs;
	}

	shgState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/shgs');
	const params = new SvelteURLSearchParams({
		per_page: PER_PAGE.toString(),
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const shgs = await response.json();

	const sortedShgs = shgs.sort((a: WP_REST_API_SHG, b: WP_REST_API_SHG) => {
		return a.title.rendered.localeCompare(b.title.rendered);
	});

	shgState.shgs = sortedShgs;
	shgState.isLoading = false;

	return sortedShgs;
};

export const getShg = async (slug: string): Promise<WP_REST_API_SHG | null> => {
	if (shgState.bySlug[slug]) {
		return shgState.bySlug[slug];
	}

	const found = shgState.shgs.find((shg) => shg.slug === slug);
	if (found) {
		shgState.bySlug[slug] = found;
		return found;
	}

	shgState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/wp/v2/shgs`);
	const params = new SvelteURLSearchParams({
		slug,
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();
	const shg = data[0] || null;

	if (shg) {
		shgState.bySlug[slug] = shg;
	}
	shgState.isLoading = false;

	return shg;
};
