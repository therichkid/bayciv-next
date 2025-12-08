import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

export interface WpPost {
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
		'wp:featuredmedia'?: {
			source_url: string;
			caption: string;
			alt_text?: string;
		}[];
	};
}

export const postState = $state<{ posts: WpPost[]; isLoading: boolean }>({
	posts: [],
	isLoading: false,
});

export const fetchPosts = async (): Promise<WpPost[]> => {
	postState.isLoading = true;

	const url = new SvelteURL('https://admin.bayciv.de/wp-json/wp/v2/posts');
	const params = new SvelteURLSearchParams({
		per_page: '10',
		_embed: 'true',
	});
	url.search = params.toString();

	const response = await fetch(url);
	const data = await response.json();

	postState.posts = data;
	postState.isLoading = false;

	return data;
};
