<script lang="ts">
	import * as Form from '$lib/components/ui/form/index.js';
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
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod4 } from 'sveltekit-superforms/adapters';

	let { formId, pageId }: { formId: number; pageId?: number } = $props();

	let form = $derived.by(() => {
		if (!formState.formsById[formId]) {
			return null;
		}

		const formSchema = buildFormSchema(formState.formsById[formId]);
		return superForm(defaults(zod4(formSchema)), {
			validators: zod4(formSchema),
			SPA: true,

			onUpdate: ({ form: f }) => {
				if (f.valid) {
					toast.success(`You submitted ${JSON.stringify(f.data, null, 2)}`);
				} else {
					toast.error('Please fix the errors in the form.');
				}
			},
		});
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

	onMount(() => {
		getForm(formId);
	});
</script>

{#if form}
	{@const { form: formData, enhance } = form}
	{@const elements = formState.formsById[formId]?.elements ?? []}

	<form method="POST" class="w-2/3 space-y-6" use:enhance>
		{#each elements as element, i (i)}
			{#if element.type === 'text_block'}
				<div>{@html element.raw_content}</div>
			{:else if element.type === 'submit'}
				<Form.Button type="submit">{element.label}</Form.Button>
			{:else}
				<Form.Field {form} name={element.name}>
					<Form.Control>
						{#snippet children({ props })}
							{#if element.label}
								<Form.Label>{element.label}</Form.Label>
							{/if}
							{#if ['text', 'number', 'email', 'tel', 'url', 'file'].includes(element.type)}
								{#if formData[element.name]}
									<Input {...props} bind:value={formData[element.name]} />
								{/if}
							{:else if element.type === 'textarea'}
								{#if formData[element.name]}
									<Textarea {...props} bind:value={formData[element.name]} />
								{/if}
							{:else if element.type === 'select'}
								{#if formData[element.name]}
									<Select.Root type="single" {...props} bind:value={formData[element.name]}>
										<Select.Trigger id={element.name} class="w-full">{element.label}</Select.Trigger>
										<Select.Content>
											{#each element.options?.filter(Boolean) ?? [] as opt, j (j)}
												<Select.Item value={opt.value ?? ''}>{opt.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
								{/if}
							{:else if element.type === 'radio'}
								{#if formData[element.name]}
									<RadioGroup.Root
										id={element.name}
										name={element.name}
										required={element.required}
										bind:value={formData[element.name]}
									>
										{#each element.options?.filter(Boolean) ?? [] as opt, j (j)}
											<div class="flex items-center gap-3">
												<RadioGroup.Item id="{element.name}-{j}" value={opt.value ?? ''} />
												<Label for="{element.name}-{j}">{opt.label}</Label>
											</div>
										{/each}
									</RadioGroup.Root>
								{/if}
							{/if}
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			{/if}
		{/each}
	</form>
{/if}
