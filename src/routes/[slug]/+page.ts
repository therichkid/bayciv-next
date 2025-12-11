import { getPage } from '$lib/page.svelte';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const { slug } = params;

	const page = await getPage(slug);

	if (!page) {
		error(404, 'Not found');
	}

	return { page };
};
