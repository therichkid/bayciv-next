import { getShgs } from '$lib/shg.svelte';
import type { PageLoad } from './$types';

export const load: PageLoad = async () => {
	const shgs = await getShgs();

	return { shgs };
};
