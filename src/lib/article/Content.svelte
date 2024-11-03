<script lang="ts">
	import markdown from '@wcj/markdown-to-html';
	export let md: string;
	const html = markdown(md);
</script>

<section class="Content">
	{@html html}
</section>
