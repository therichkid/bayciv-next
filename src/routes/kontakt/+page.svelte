<script lang="ts">
	import { onMount } from 'svelte';

	onMount(() => {
		Tally.loadEmbeds();
	});
</script>

<h1 class="pt-12 pb-8 text-3xl font-semibold">Kontaktformular</h1>

<iframe
	data-tally-src="https://tally.so/embed/1AXE04?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
	loading="lazy"
	width="100%"
	height="auto"
	frameborder="0"
	marginheight="0"
	marginwidth="0"
	title="Kontaktformular"
></iframe>
