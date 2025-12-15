import type { WP_REST_API_Form } from '$lib/models/wordpress';
import { z } from 'zod';

export const buildFormSchema = (form: WP_REST_API_Form) => {
	return form.elements
		.filter((element) => element.type === 'field')
		.reduce((schema, element) => {
			const elementName = element.label || element.name;

			let validation;
			switch (element.tag_type) {
				case 'text':
				case 'textarea':
					validation = z.string({
						error: `${elementName} muss ein Text sein.`,
					});
					break;
				case 'number':
					validation = z.number({
						error: `${elementName} muss eine Zahl sein.`,
					});
					if (element.min) {
						validation = validation.min(Number(element.min), {
							error: `${elementName} muss mindestens ${element.min} sein.`,
						});
					}
					if (element.max) {
						validation = validation.max(Number(element.max), {
							message: `${elementName} darf höchstens ${element.max} sein.`,
						});
					}
					break;
				case 'date':
					validation = z.date({
						error: `${elementName} muss ein gültiges Datum sein.`,
					});
					if (element.min) {
						validation = validation.min(new Date(element.min), {
							message: `${elementName} muss nach dem ${element.min} liegen.`,
						});
					}
					if (element.max) {
						validation = validation.max(new Date(element.max), {
							message: `${elementName} muss vor dem ${element.max} liegen.`,
						});
					}
					break;
				case 'email':
					validation = z.email({
						message: `${elementName} muss eine gültige E-Mail-Adresse sein.`,
					});
					break;
				case 'tel':
					validation = z.e164({
						message: `${elementName} muss eine gültige Telefonnummer sein.`,
					});
					break;
				case 'url':
					validation = z.url({
						message: `${elementName} muss eine gültige URL sein.`,
					});
					break;
				case 'file':
					validation = z.file({
						message: `${elementName} muss eine gültige Datei sein.`,
					});
					break;
				case 'select':
				case 'checkbox':
					if (element.multiple) {
						validation = z.array(
							z.enum(element.options?.filter((opt): opt is string => opt !== null) || [], {
								error: () => ({ message: `${elementName} enthält ungültige Auswahl.` }),
							}),
						);
					} else {
						validation = z.enum(element.options?.filter((opt): opt is string => opt !== null) || [], {
							error: () => ({ message: `${elementName} enthält ungültige Auswahl.` }),
						});
					}
					break;
				case 'radio':
					validation = z.enum(element.options?.filter((opt): opt is string => opt !== null) || [], {
						error: () => ({ message: `${elementName} enthält ungültige Auswahl.` }),
					});
					break;
				default:
					throw new Error(`Unbekannter Elementtyp: ${element.tag_type}`);
			}

			if (!element.required) {
				validation = validation.optional();
			}

			return schema.extend({
				[element.name]: validation,
			});
		}, z.object({}));
};
