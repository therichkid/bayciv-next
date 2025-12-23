import type { WP_REST_API_Embedded_Term } from '$lib/models/wordpress';

export const getGroupNames = (termGroups: WP_REST_API_Embedded_Term[][] | undefined): string[] => {
	const groupNames: string[] = [];

	for (const termGroup of termGroups || []) {
		for (const term of termGroup) {
			if (term.taxonomy === 'category' && term.slug !== 'selbsthilfegruppen') {
				groupNames.push(term.name);
			}
		}
	}

	return groupNames;
};
