<script lang="ts">
	import markdownit from 'markdown-it';
	export let md: string;
	const converter = markdownit({
		html: true,
		linkify: true,
		typographer: true
	});
	const html = converter.render(md);
</script>

<section class="Content">
	{@html html}
</section>
