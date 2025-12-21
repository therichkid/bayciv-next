export interface WP_REST_API_Page_ACF {
	abweichender_autor: string;
	formular_id?: number;
}

export interface WP_REST_API_Post_ACF {
	abweichender_autor: string;
	bilder: number[] | '';
}

export interface WP_REST_API_SHG_ACF {
	adressname: string;
	adresse: ACF_Address | false;
	email: string;
	instagram: string;
	facebook: string;
	telefon: string;
	mobil: string;
	fax: string;
	homepage: string;
	region: string;
	zielgruppe: 'Erwachsene' | 'Kinder';
	'online-gruppe': boolean;
	weitere_adressen: null;
	postanschriftsname: string;
	postanschrift: ACF_Address | null;
}

export interface WP_REST_API_Event_ACF {
	event_datum: string;
	event_datum_ende: string;
	zeit_von: string;
	zeit_bis: string;
	adressname: string;
	adresse: ACF_Address | false;
	hauptevent: boolean;
	anmeldung: boolean;
	formular_id?: number;
}

export interface ACF_Address {
	address: string;
	lat: number;
	lng: number;
	street_number?: string;
	street_name?: string;
	street_name_short?: string;
	city: string;
	state: string;
	state_short: string;
	post_code: string;
	country: string;
	country_short: string;
}
