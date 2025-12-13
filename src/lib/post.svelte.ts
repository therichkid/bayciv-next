import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { WP_REST_API_Post, WP_REST_API_Posts } from 'wp-types';

export const postState = $state<{
	postsByPage: Record<number, WP_REST_API_Posts>;
	postsBySlug: Record<string, WP_REST_API_Post>;
	isLoading: boolean;
	totalPages: number;
}>({
	postsByPage: {},
	postsBySlug: {},
	isLoading: false,
	totalPages: 1,
});

export const getPosts = async (page: number = 1): Promise<WP_REST_API_Posts> => {
	if (postState.postsByPage[page]) {
		return postState.postsByPage[page];
	}

	postState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/posts');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		page: page.toString(),
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const posts = await response.json();

	const totalPages = parseInt(response.headers.get('X-WP-TotalPages') || '1', 10);
	postState.totalPages = totalPages;

	postState.postsByPage[page] = posts;
	postState.isLoading = false;

	return posts;
};

export const getPost = async (slug: string): Promise<WP_REST_API_Post | null> => {
	if (postState.postsBySlug[slug]) {
		return postState.postsBySlug[slug];
	}

	for (const posts of Object.values(postState.postsByPage)) {
		const found = posts.find((post) => post.slug === slug);
		if (found) {
			postState.postsBySlug[slug] = found;
			return found;
		}
	}

	postState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/wp/v2/posts`);
	const params = new SvelteURLSearchParams({
		slug,
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();
	const post = data[0] || null;

	if (post) {
		postState.postsBySlug[slug] = post;
	}
	postState.isLoading = false;

	return post;
};
