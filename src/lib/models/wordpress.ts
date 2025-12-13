import type { WP_REST_API_Post } from 'wp-types';

export type WP_REST_API_Event = WP_REST_API_Post;
export type WP_REST_API_Events = WP_REST_API_Post[];

export type WP_REST_API_SHG = WP_REST_API_Post;
export type WP_REST_API_SHGs = WP_REST_API_Post[];

export type WP_REST_API_Form = (
	| {
			type: 'text_block';
			content: string;
	  }
	| {
			type: 'field';
			tag_type:
				| 'text'
				| 'number'
				| 'textarea'
				| 'date'
				| 'email'
				| 'tel'
				| 'url'
				| 'file'
				| 'select'
				| 'checkbox'
				| 'radio'
				| 'acceptance'
				| 'quiz'
				| 'submit';
			name: string;
			required: boolean;
			label?: string;
			placeholder?: string;
			default_value?: string;
			options?: (string | null)[];
			multiple?: boolean;
			min?: string;
			max?: string;
			markup_source: `[${string}]`;
	  }
)[];

export interface WP_REST_API_Embedded {
	author?: WP_REST_API_Embedded_Author[];
	'wp:featuredmedia'?: WP_REST_API_Embedded_FeaturedMedia[];
	'wp:term'?: WP_REST_API_Embedded_Term[][];
}

export interface WP_REST_API_Embedded_Author {
	id: number;
	name: string;
	slug: string;
}

export interface WP_REST_API_Embedded_FeaturedMedia {
	source_url: string;
	caption: { rendered: string };
	alt_text: string;
	media_type: string;
	mime_type: string;
	media_details?: {
		width: number;
		height: number;
		file: string;
		sizes?: {
			thumbnail?: { source_url: string; width: number; height: number; mime_type: string };
			medium?: { source_url: string; width: number; height: number; mime_type: string };
			medium_large?: { source_url: string; width: number; height: number; mime_type: string };
			full?: { source_url: string; width: number; height: number; mime_type: string };
		};
	};
}

export interface WP_REST_API_Embedded_Term {
	id: number;
	name: string;
	slug: string;
	taxonomy: 'category' | 'post_tag' | 'einrichtungstyp';
}
