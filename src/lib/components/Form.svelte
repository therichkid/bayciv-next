<script lang="ts">
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { formState, getForm } from '$lib/form.svelte';
	import { buildFormSchema } from '$lib/formSchema';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';
	import type { $ZodIssue } from 'zod/v4/core';
	import { Button } from './ui/button';

	let { formId, pageId }: { formId: number; pageId?: number } = $props();

	let formErrors = $state<Record<string, $ZodIssue[]>>({});

	let formData = $derived.by(() => {
		const data: Record<string, any> = {};

		if (!formState.formsById[formId]) {
			return data;
		}

		formState.formsById[formId].elements.reduce((data, element) => {
			if (element.type === 'text_block' || element.type === 'submit') {
				return data;
			}

			data[element.name] = element.default_value ?? '';
			return data;
		}, data);
		return data;
	});

	let actionUrl = $derived.by(() => {
		const url = new SvelteURL(`https://admin.bayciv.de/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`);
		const randomCount = Math.floor(Math.random() * 256);
		const params = new SvelteURLSearchParams({
			_wpcf7_unit_tag: `f${formId}-p${pageId || 0}-o${randomCount}`,
		});
		url.search = params.toString();

		return url.toString();
	});

	const handleSubmit = async (event: Event) => {
		event.preventDefault();

		const schema = buildFormSchema(formState.formsById[formId]);
		const validation = schema.safeParse(formData);

		if (validation.success === false) {
			formErrors = validation.error.issues.reduce(
				(errorMap, issue) => {
					const formName = issue.path[0] as string;
					if (!errorMap[formName]) {
						errorMap[formName] = [];
					}
					errorMap[formName].push(issue);
					return errorMap;
				},
				{} as Record<string, $ZodIssue[]>,
			);

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
				toast.success('Kontaktformular erfolgreich gesendet.');
				formEl.reset();
			} else {
				toast.error('Fehler beim Senden des Kontaktformulars.');
			}
		} catch {
			toast.error('Netzwerkfehler beim Senden des Kontaktformulars.');
		}
	};

	onMount(() => {
		getForm(formId);
	});
</script>

{#if Object.keys(formData).length}
	{@const elements = formState.formsById[formId]?.elements ?? []}

	<form method="POST" action={actionUrl} onsubmit={handleSubmit} class="w-2/3 space-y-6">
		{#each elements as element, i (i)}
			{#if element.type === 'text_block'}
				<div>{@html element.raw_content}</div>
			{:else if element.type === 'submit'}
				<Button type="submit">{element.label}</Button>
			{:else}
				{#if element.label}
					<Label id={element.name}>{element.label}</Label>
				{/if}
				{#if ['text', 'number', 'email', 'tel', 'url', 'file'].includes(element.type)}
					<Input
						type={element.type}
						name={element.name}
						id={element.name}
						required={element.required}
						bind:value={formData[element.name]}
						oninput={() => {
							if (formErrors[element.name]) {
								delete formErrors[element.name];
							}
						}}
					/>
				{:else if element.type === 'textarea'}
					<Textarea name={element.name} required={element.required} bind:value={formData[element.name]} />
				{:else if element.type === 'select'}
					<Select.Root
						type={element.multiple ? 'multiple' : 'single'}
						name={element.name}
						required={element.required}
						value={formData[element.name]}
						onValueChange={() => {
							if (formErrors[element.name]) {
								delete formErrors[element.name];
							}
						}}
					>
						<Select.Trigger id={element.name} class="w-full">{element.label}</Select.Trigger>
						<Select.Content>
							{#each element.options ?? [] as option, j (j)}
								<Select.Item value={option.value ?? ''} disabled={!option.value}>{option.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{:else if element.type === 'radio'}
					<RadioGroup.Root
						name={element.name}
						id={element.name}
						required={element.required}
						value={formData[element.name]}
						oninput={() => {
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
					{#each formErrors[element.name] as issue, j (j)}
						<p class="text-sm text-red-600">{issue.message}</p>
					{/each}
				{/if}
			{/if}
		{/each}
	</form>
{/if}
