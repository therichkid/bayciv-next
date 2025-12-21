import type { WP_REST_API_Page, WP_REST_API_Post } from 'wp-types';
import type { WP_REST_API_Event_ACF, WP_REST_API_Page_ACF, WP_REST_API_Post_ACF, WP_REST_API_SHG_ACF } from './acf';

export type Custom_WP_REST_API_Page = WP_REST_API_Page & {
	_embedded: WP_REST_API_Embedded;
	acf: WP_REST_API_Page_ACF;
};
export type Custom_WP_REST_API_Pages = Custom_WP_REST_API_Page[];

export type Custom_WP_REST_API_Post = WP_REST_API_Post & {
	_embedded: WP_REST_API_Embedded;
	acf: WP_REST_API_Post_ACF;
};
export type Custom_WP_REST_API_Posts = Custom_WP_REST_API_Post[];

export type WP_REST_API_Event = WP_REST_API_Post & {
	_embedded: WP_REST_API_Embedded;
	acf: WP_REST_API_Event_ACF;
};
export type WP_REST_API_Events = WP_REST_API_Event[];

export type WP_REST_API_SHG = WP_REST_API_Post & {
	_embedded: WP_REST_API_Embedded;
	acf: WP_REST_API_SHG_ACF;
	gruppenmerkmal: number[];
};
export type WP_REST_API_SHGs = WP_REST_API_SHG[];

export interface WP_REST_API_Form {
	id: number;
	title: string;
	elements: WP_REST_API_Form_Element[];
}

export type WP_REST_API_Form_Element = WP_REST_API_Form_Text_Block | WP_REST_API_Form_Submit | WP_REST_API_Form_Field;

export interface WP_REST_API_Form_Text_Block {
	type: 'text_block';
	raw_content: string;
}

export interface WP_REST_API_Form_Submit {
	type: 'submit';
	label: string;
	raw_content: string;
}

export interface WP_REST_API_Form_Field {
	type:
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
		| 'quiz';
	name: string;
	required: boolean;
	label: string | null;
	options: { label: string; value: string | null }[];
	multiple: boolean;
	default_value: string | null;
	min: number | string | null;
	max: number | string | null;
	raw_content: string;
}

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
	taxonomy: 'category' | 'post_tag' | 'gruppenmerkmal' | 'einrichtungstyp';
}
