import { SvelteURL } from 'svelte/reactivity';
import type { WP_REST_API_Form } from './models/wordpress';

export const formState = $state<{
	formsById: Record<string, WP_REST_API_Form>;
	isLoading: boolean;
}>({
	formsById: {},
	isLoading: false,
});

export const getForm = async (id: number): Promise<WP_REST_API_Form | null> => {
	if (formState.formsById[id]) {
		return formState.formsById[id];
	}

	formState.isLoading = true;

	const url = new SvelteURL(`https://admin.bayciv.de/wp-json/custom/v1/forms/${id}`);

	const response = await fetch(url);
	const data = await response.json();

	if (data) {
		formState.formsById[id] = data;
	}
	formState.isLoading = false;

	return data;
};
