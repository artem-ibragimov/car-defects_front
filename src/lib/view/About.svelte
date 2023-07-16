<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="About">
	<details class="About__details">
		<summary> {$_('text.about.header')}</summary>
		<p>
			{@html $_('text.about.why')}
		</p>
		<p>
			{@html $_('text.about.concurrents')}
		</p>
		<p>
			{@html $_('text.about.website')}<a href="http://car-defects.com/">car-defects.com</a>, {@html $_(
				'text.about.website_details'
			)}
		</p>
		<p>{@html $_('text.about.project')}</p>
	</details>
</div>

<style scoped>
	.About {
		padding: 15px;
	}
	.About__details {
		margin: auto;
		max-width: 850px;
	}
</style>
