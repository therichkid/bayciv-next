import { Activity, Baby, BicepsFlexed, CircleQuestionMark, Globe, MapPin, Smile } from '@lucide/svelte';
import { type Component } from 'svelte';

interface TaxonomyTermDisplayProps {
	icon: Component;
	color: string;
}

export const TAXONOMY_DISPLAY_MAP: Record<string, Record<string, TaxonomyTermDisplayProps>> = {
	gruppenmerkmal: {
		'fuer-erwachsene': {
			icon: Smile,
			color: 'blue',
		},
		'fuer-kinder': {
			icon: Baby,
			color: 'pink',
		},
		'trifft-sich-vor-ort': {
			icon: MapPin,
			color: 'green',
		},
		'trifft-sich-online': {
			icon: Globe,
			color: 'cyan',
		},
	},
	einrichtungstyp: {
		beratungsstelle: {
			icon: CircleQuestionMark,
			color: 'blue',
		},
		klinik: {
			icon: Activity,
			color: 'red',
		},
		reha: {
			icon: BicepsFlexed,
			color: 'pink',
		},
	},
};
