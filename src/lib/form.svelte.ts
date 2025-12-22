import type { WP_REST_API_Form } from '$lib/models/wordpress';
import { SvelteURL } from 'svelte/reactivity';

export const formState = $state<{
	byId: Record<string, WP_REST_API_Form>;
	isLoading: boolean;
}>({
	byId: {},
	isLoading: false,
});

export const getForm = async (id: number): Promise<WP_REST_API_Form | null> => {
	if (formState.byId[id]) {
		return formState.byId[id];
	}

	formState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/custom/v1/forms/${id}`);

	const response = await fetch(url);
	const data = await response.json();

	if (data) {
		formState.byId[id] = data;
	}
	formState.isLoading = false;

	return data;
};
