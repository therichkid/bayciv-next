<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { TAXONOMY_DISPLAY_MAP } from '$lib/constants/taxonomy';
	import { getTaxonomyTerms } from '$lib/taxonomy.svelte';
	import { getRandomTailwindColor } from '$lib/utils/random';
	import { Check } from '@lucide/svelte';
	import { onMount } from 'svelte';
	import type { WP_REST_API_Term } from 'wp-types';

	interface Props {
		slug: string;
		selectedTermIds?: number[];
		onTermIdChange?: (selectedTermIds: number[]) => void;
	}

	let { slug, selectedTermIds = $bindable([]), onTermIdChange = () => {} }: Props = $props();

	let taxonomyTerms = $state<WP_REST_API_Term[]>([]);

	onMount(async () => {
		taxonomyTerms = await getTaxonomyTerms(slug);
	});

	const toggleTermId = (id: number) => {
		if (selectedTermIds.includes(id)) {
			selectedTermIds = selectedTermIds.filter((termId) => termId !== id);
		} else {
			selectedTermIds = [...selectedTermIds, id];
		}

		onTermIdChange(selectedTermIds);
	};
</script>

<div class="flex h-full w-full flex-wrap gap-2">
	{#each taxonomyTerms as taxonomyTerm (taxonomyTerm.id)}
		{@const color = TAXONOMY_DISPLAY_MAP[slug]?.[taxonomyTerm.slug]?.color || getRandomTailwindColor(taxonomyTerm.slug)}
		{@const IconComponent = TAXONOMY_DISPLAY_MAP[slug]?.[taxonomyTerm.slug]?.icon}

		<Badge
			class="h-fit cursor-pointer bg-{color}-100 py-1 text-{color}-950 hover:bg-{color}-200"
			role="button"
			onclick={() => toggleTermId(taxonomyTerm.id)}
		>
			{#if IconComponent}
				<IconComponent />
			{/if}
			{taxonomyTerm.name}
			({taxonomyTerm.count})
			{#if selectedTermIds.includes(taxonomyTerm.id)}
				<Check class="ml-1" strokeWidth={3} />
			{/if}
		</Badge>
	{/each}
</div>
