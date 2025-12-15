<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as RadioGroup from '$lib/components/ui/radio-group/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import { Textarea } from '$lib/components/ui/textarea/index.js';
	import { formState, getForm } from '$lib/form.svelte';
	import { onMount } from 'svelte';
	import { SvelteURL, SvelteURLSearchParams } from 'svelte/reactivity';

	let { formId, pageId }: { formId: number; pageId?: number } = $props();

	let formData = $derived.by(() =>
		(formState.formsById[formId]?.elements ?? [])
			.filter((field) => field.type === 'field')
			.reduce(
				(acc, field) => {
					acc[field.name] = field.default_value || '';
					return acc;
				},
				{} as Record<string, string | string[] | boolean>,
			),
	);

	let isSubmitting = $state<boolean>(false);
	let successMsg = $state<string>('');
	let errorMsg = $state<string>('');

	let actionUrl = $derived.by(() => {
		const url = new SvelteURL(`https://admin.bayciv.de/wp-json/contact-form-7/v1/contact-forms/${formId}/feedback`);
		const randomCount = Math.floor(Math.random() * 256);
		const params = new SvelteURLSearchParams({
			_wpcf7_unit_tag: `f${formId}-p${pageId || 0}-o${randomCount}`,
		});
		url.search = params.toString();

		return url.toString();
	});

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		successMsg = '';
		errorMsg = '';

		const formEl = event.currentTarget as HTMLFormElement;
		const formData = new FormData(formEl);

		try {
			const response = await fetch(actionUrl, {
				method: 'POST',
				body: formData,
			});
			const data = await response.json();
			if (data.status === 'mail_sent') {
				successMsg = data.message;
				formEl.reset();
			} else {
				errorMsg = data.message || 'Fehler beim Senden.';
			}
		} catch {
			errorMsg = 'Netzwerkfehler.';
		} finally {
			isSubmitting = false;
		}
	}

	onMount(() => {
		getForm(formId);
	});
</script>

<form action={actionUrl} method="POST" enctype="multipart/form-data" onsubmit={handleSubmit} class="space-y-4">
	{#each formState.formsById[formId]?.elements ?? [] as field, i (i)}
		{#if field.type === 'text_block'}
			<div>{@html field.content}</div>
		{:else if field.type === 'field'}
			<div class="flex w-full max-w-sm flex-col gap-1.5">
				{#if field.label}
					<Label for={field.name}>{field.label}</Label>
				{/if}

				{#if ['text', 'number', 'email', 'tel', 'url', 'file'].includes(field.tag_type)}
					<Input
						type={field.tag_type}
						id={field.name}
						name={field.name}
						placeholder={field.placeholder ?? field.label ?? ''}
						required={field.required}
						value={formData[field.name]}
					/>
				{:else if field.tag_type === 'date'}
					<!-- TODO -->
				{:else if field.tag_type === 'textarea'}
					<Textarea
						id={field.name}
						name={field.name}
						placeholder={field.placeholder ?? field.label ?? ''}
						required={field.required}
						rows={4}
						value={formData[field.name]}
					/>
				{:else if field.tag_type === 'select'}
					<Select.Root
						type={field.multiple ? 'multiple' : 'single'}
						name={field.name}
						required={field.required}
						value={formData[field.name]}
					>
						<Select.Trigger id={field.name} class="w-full">{field.label}</Select.Trigger>
						<Select.Content>
							{#each field.options?.filter(Boolean) ?? [] as opt, j (j)}
								<Select.Item value={opt ?? ''}>{opt}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root>
				{:else if field.tag_type === 'checkbox'}
					{#each field.options?.filter(Boolean) ?? [] as opt, j (j)}
						<div class="flex items-center space-x-2">
							<Checkbox
								id="{field.name}-{j}"
								required={field.required}
								onCheckedChange={(value: boolean) => {
									const current = formData[field.name] as string[];
									if (value) {
										formData[field.name] = [...(current ?? []), opt ?? ''];
									} else {
										formData[field.name] = (current ?? []).filter((v) => v !== opt);
									}
								}}
							/>
							<Label for="{field.name}-{j}">{opt}</Label>
						</div>
					{/each}
					<input type="checkbox" id={field.name} name={field.name} checked={formData[field.name]} hidden />
				{:else if field.tag_type === 'radio'}
					<RadioGroup.Root id={field.name} name={field.name} required={field.required} value={formData[field.name]}>
						{#each field.options?.filter(Boolean) ?? [] as opt, j (j)}
							<div class="flex items-center gap-3">
								<RadioGroup.Item id="{field.name}-{j}" value={opt ?? ''} />
								<Label for="{field.name}-{j}">{opt}</Label>
							</div>
						{/each}
					</RadioGroup.Root>
				{:else if field.tag_type === 'submit'}
					<Button type="submit">{field.label}</Button>
				{/if}
			</div>
		{/if}
	{/each}

	<Button type="submit" disabled={isSubmitting}>Senden</Button>

	{#if successMsg}
		<div class="text-green-600">{successMsg}</div>
	{/if}
	{#if errorMsg}
		<div class="text-red-600">{errorMsg}</div>
	{/if}
</form>
