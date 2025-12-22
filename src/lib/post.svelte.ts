import { SvelteMap, SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
import type { Custom_WP_REST_API_Post, Custom_WP_REST_API_Posts } from './models/wordpress';

interface PostMeta {
	totalPosts: number;
	totalPages: number;
}

const PER_PAGE = 10;

export const postState = $state<
	{
		posts: SvelteMap<number, Custom_WP_REST_API_Posts>;
		bySlug: SvelteMap<string, Custom_WP_REST_API_Post>;
		isLoading: boolean;
	} & PostMeta
>({
	posts: new SvelteMap(),
	bySlug: new SvelteMap(),
	isLoading: false,
	totalPosts: 0,
	totalPages: 0,
});

export const getPosts = async (page: number = 1): Promise<{ posts: Custom_WP_REST_API_Posts } & PostMeta> => {
	const cache = postState.posts.get(page);
	if (cache) {
		return {
			posts: cache,
			totalPosts: postState.totalPosts,
			totalPages: postState.totalPages,
		};
	}

	postState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/posts');
	const params = new SvelteURLSearchParams({
		per_page: PER_PAGE.toString(),
		page: page.toString(),
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);

	const totalEvents = response.headers.get('X-WP-Total');
	const totalPages = response.headers.get('X-WP-TotalPages');

	const posts = await response.json();

	postState.posts.set(page, posts);
	postState.totalPosts = totalEvents ? parseInt(totalEvents, 10) : 0;
	postState.totalPages = totalPages ? parseInt(totalPages, 10) : 0;

	postState.isLoading = false;

	return {
		posts,
		totalPosts: postState.totalPosts,
		totalPages: postState.totalPages,
	};
};

export const getPost = async (slug: string): Promise<Custom_WP_REST_API_Post | null> => {
	const cache = postState.bySlug.get(slug);
	if (cache) {
		return cache;
	}

	for (const posts of postState.posts.values()) {
		const found = posts.find((post) => post.slug === slug);
		if (found) {
			postState.bySlug.set(slug, found);
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
		postState.bySlug.set(slug, post);
	}
	postState.isLoading = false;

	return post;
};
