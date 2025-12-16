<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { formState, getForm } from '$lib/form.svelte';
	import { buildFormSchema } from '$lib/formSchema';
	import type { WP_REST_API_Form_Field } from '$lib/models/wordpress';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
	import { z } from 'zod';
	import { Button } from './ui/button';

	let { formId, pageId }: { formId: number; pageId?: number } = $props();

	let formData = $state<Record<string, any>>({});

	$effect(() => {
		if (formState.formsById[formId]) {
			formData = getEmptyFormData();
		}
	});

	const getEmptyFormData = () => {
		return (formState.formsById[formId]?.elements || []).reduce(
			(data, element) => {
				if (element.type === 'text_block' || element.type === 'submit') {
					return data;
				}
				if (element.type === 'checkbox' || element.type === 'acceptance') {
					data[element.name] = new Array(element.options?.length || 0).fill(false);
				} else if (element.type === 'quiz') {
					data[element.name] = new Array(element.options?.length || 0).fill('');
				} else if (element.multiple) {
					data[element.name] = element.default_value ? [element.default_value] : [];
				} else {
					data[element.name] = element.default_value ?? '';
				}
				return data;
			},
			{} as Record<string, any>,
		);
	};

	let formErrors = $state<Record<string, { errors: string[] }>>({});

	const validateForm = (): boolean => {
		const schema = buildFormSchema(formState.formsById[formId]);
		const validation = schema.safeParse(formData);

		if (validation.success === false) {
			formErrors = z.treeifyError(validation.error).properties as unknown as Record<string, { errors: string[] }>;
			return false;
		} else {
			formErrors = {};
			return true;
		}
	};

	let actionUrl = $derived.by(() => {
		const url = new SvelteURL(`https://admin.bayciv.de/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`);
		const params = new SvelteURLSearchParams({
			_wpcf7_unit_tag: `f${formId}-p${pageId ?? 1}-o1`,
		});
		url.search = params.toString();

		return url.toString();
	});

	const getSelectLabel = (element: WP_REST_API_Form_Field, value: string | string[]) => {
		const getOptionLabel = (element: WP_REST_API_Form_Field, value: string) => {
			const option = element.options?.find((opt) => opt.value === value);
			return option ? option.label : undefined;
		};

		const matchingLabels = Array.isArray(value)
			? value
					.map((val) => getOptionLabel(element, val))
					.filter((label) => label !== undefined)
					.join(', ')
			: getOptionLabel(element, value);

		if (matchingLabels) {
			return matchingLabels;
		}
		return element.label || '';
	};

	const hasSubmitButton = $derived.by(() => {
		const elements = formState.formsById[formId]?.elements ?? [];
		return elements.some((element) => element.type === 'submit');
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		if (!validateForm()) {
			toast.error('Bitte beheben Sie die Fehler im Formular.');
			return;
		}

		const formEl = event.target as HTMLFormElement;
		const formBody = new FormData(formEl);

		try {
			const response = await fetch(actionUrl, {
				method: 'POST',
				body: formBody,
			});
			const data = await response.json();

			if (data.status === 'mail_sent') {
				toast.success('Formular erfolgreich gesendet.');

				formEl.reset();
				formData = getEmptyFormData();
				formErrors = {};
			} else {
				toast.error(data.message || 'Fehler beim Senden des Formulars. Bitte versuchen Sie es später erneut.');
			}
		} catch (error) {
			toast.error('Fehler beim Senden des Formulars. Bitte versuchen Sie es später erneut.');
			console.error(error);
		}
	};

	onMount(() => {
		getForm(formId);
	});
</script>

{#if Object.keys(formData).length}
	{@const elements = formState.formsById[formId]?.elements ?? []}

	<form method="POST" onsubmit={handleSubmit} novalidate class="max-w-xl space-y-6">
		{#each elements as element, i (i)}
			{#if element.type === 'text_block'}
				<div>{@html element.raw_content}</div>
			{:else if element.type === 'submit'}
				<Button type="submit">{element.label}</Button>
			{:else}
				<Field.Field>
					{#if element.label}
						<Field.Label for={element.name}>{element.label}</Field.Label>
					{/if}
					{#if ['text', 'number', 'date', 'email', 'tel', 'url', 'file', 'quiz'].includes(element.type)}
						<Input
							type={element.type}
							name={element.name}
							id={element.name}
							required={element.required}
							aria-invalid={formErrors[element.name] ? 'true' : 'false'}
							bind:value={formData[element.name]}
							oninput={() => {
								if (formErrors[element.name]) {
									delete formErrors[element.name];
								}
							}}
						/>
					{:else if element.type === 'textarea'}
						<Textarea
							name={element.name}
							id={element.name}
							rows={5}
							required={element.required}
							aria-invalid={formErrors[element.name] ? 'true' : 'false'}
							bind:value={formData[element.name]}
							oninput={() => {
								if (formErrors[element.name]) {
									delete formErrors[element.name];
								}
							}}
						/>
					{:else if element.type === 'select'}
						<Select.Root
							type={element.multiple ? 'multiple' : 'single'}
							name={element.multiple ? `${element.name}[]` : element.name}
							required={element.required}
							bind:value={formData[element.name]}
							onValueChange={(value: string | string[]) => {
								formData = { ...formData, [element.name]: value };

								if (formErrors[element.name]) {
									delete formErrors[element.name];
								}
							}}
						>
							<Select.Trigger
								id={element.name}
								aria-invalid={formErrors[element.name] ? 'true' : 'false'}
								class="w-full"
							>
								{getSelectLabel(element, formData[element.name])}
							</Select.Trigger>
							<Select.Content>
								{#each element.options ?? [] as option, j (j)}
									<Select.Item value={option.value ?? ''} disabled={!option.value}>{option.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{:else if element.type === 'checkbox' || element.type === 'acceptance'}
						{#each element.options ?? [] as option, j (j)}
							<div class="flex items-center gap-3">
								<Checkbox
									name={`${element.name}[]`}
									id={`${element.name}-${j}`}
									required={element.required}
									bind:checked={formData[element.name][j]}
									onCheckedChange={(value: boolean) => {
										formData = {
											...formData,
											[element.name]: formData[element.name].map((v: boolean, idx: number) =>
												element.multiple ? (idx === j ? value : v) : idx === j ? value : false,
											),
										};

										if (formErrors[element.name]) {
											delete formErrors[element.name];
										}
									}}
								/>
								<Label for={`${element.name}-${j}`}>{option.label}</Label>
							</div>
						{/each}
					{:else if element.type === 'radio'}
						<RadioGroup.Root
							name={element.name}
							id={element.name}
							required={element.required}
							aria-invalid={formErrors[element.name] ? 'true' : 'false'}
							bind:value={formData[element.name]}
							onValueChange={(value: string) => {
								formData = { ...formData, [element.name]: value };

								if (formErrors[element.name]) {
									delete formErrors[element.name];
								}
							}}
						>
							{#each element.options ?? [] as option, j (j)}
								<div class="flex items-center gap-3">
									<RadioGroup.Item id="{element.name}-{j}" value={option.value ?? ''} />
									<Label for="{element.name}-{j}">{option.label}</Label>
								</div>
							{/each}
						</RadioGroup.Root>
					{/if}
					{#if formErrors[element.name]}
						{#each formErrors[element.name].errors as error, j (j)}
							<Field.Error>{error}</Field.Error>
						{/each}
					{/if}
				</Field.Field>
			{/if}
		{/each}

		{#if !hasSubmitButton}
			<Button type="submit">Absenden</Button>
		{/if}
	</form>
{/if}
