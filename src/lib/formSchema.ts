import type { WP_REST_API_Form } from '$lib/models/wordpress';
import { z } from 'zod';

export const buildFormSchema = (form: WP_REST_API_Form) => {
	return form.elements.reduce((schema, element) => {
		if (element.type === 'text_block' || element.type === 'submit') {
			return schema;
		}

		const elementName = element.label || element.name;
		let validation;

		switch (element.type) {
			case 'text':
			case 'textarea':
			case 'tel':
				validation = z.string({
					error: `${elementName} muss ein Text sein.`,
				});
				if (element.min) {
					validation = validation.min(Number(element.min), {
						message: `${elementName} muss mindestens ${element.min} Zeichen lang sein.`,
					});
				}
				if (element.max) {
					validation = validation.max(Number(element.max), {
						message: `${elementName} darf höchstens ${element.max} Zeichen lang sein.`,
					});
				}
				if (element.required && !element.min) {
					validation = validation.min(1, {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
					});
				}
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
				if (element.required && !element.min) {
					validation = validation.min(1, {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
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
				if (element.required && !element.min) {
					validation = validation.min(new Date('1900-01-01'), {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
					});
				}
				break;
			case 'email':
				validation = z.email({
					message: `${elementName} muss eine gültige E-Mail-Adresse sein.`,
				});
				if (element.required) {
					validation = validation.min(1, {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
					});
				}
				break;
			case 'url':
				validation = z.url({
					message: `${elementName} muss eine gültige URL sein.`,
				});
				if (element.required) {
					validation = validation.min(1, {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
					});
				}
				break;
			case 'file':
				validation = z.file({
					message: `${elementName} muss eine gültige Datei sein.`,
				});
				if (element.required) {
					validation = validation.refine((file) => file.size > 0, {
						message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
					});
				}
				break;
			case 'select': {
				const optionValues = (element.options ?? []).map((opt) => opt.value).filter((v): v is string => v !== null);
				if (element.multiple) {
					validation = z.array(
						z.enum(optionValues, {
							error: () => ({ message: `${elementName} enthält eine ungültige Auswahl.` }),
						}),
					);
					if (element.required) {
						validation = validation.min(1, {
							message: `${elementName} ist ein Pflichtfeld und darf nicht leer sein.`,
						});
					}
				} else {
					validation = z.enum(optionValues, {
						error: () => ({ message: `${elementName} enthält eine ungültige Auswahl.` }),
					});
				}
				break;
			}
			case 'checkbox':
			case 'acceptance':
				validation = z.array(
					z.boolean({
						error: `${elementName} muss ein Wahrheitswert (true/false) sein.`,
					}),
				);
				if (!element.multiple) {
					validation = validation.refine((arr) => arr.filter(Boolean).length <= 1, {
						message: `${elementName} darf höchstens einmal ausgewählt sein.`,
					});
				}
				if (element.required) {
					validation = validation.refine((arr) => arr.includes(true), {
						message: `${elementName} ist ein Pflichtfeld und muss ausgewählt sein.`,
					});
				}
				break;
			case 'radio': {
				const optionValues = (element.options ?? []).map((opt) => opt.value).filter((v): v is string => v !== null);
				validation = z.enum(optionValues, {
					error: () => ({ message: `${elementName} enthält eine ungültige Auswahl.` }),
				});
				break;
			}
			case 'quiz': {
				const correctAnswers = (element.options ?? []).map((opt) => opt.value);
				validation = z
					.array(z.string(), {
						error: `${elementName} muss ein Array von Antworten sein.`,
					})
					.length(correctAnswers.length, {
						message: `${elementName} muss genau ${correctAnswers.length} Antworten enthalten.`,
					})
					.refine((answers) => answers.every((ans, i) => ans === correctAnswers[i]), {
						message: `${elementName} enthält eine oder mehrere falsche Antworten.`,
					});
				break;
			}
		}

		if (!validation) {
			console.warn(`Unbekannter Elementtyp: ${element.type} für Element ${elementName}`);
			return schema;
		}

		if (!element.required) {
			validation = validation.optional().or(z.literal(''));
		}

		return schema.extend({
			[element.name]: validation,
		});
	}, z.object({}));
};
