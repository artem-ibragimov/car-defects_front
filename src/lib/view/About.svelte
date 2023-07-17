<script lang="ts">
	import { _ } from 'svelte-i18n';
</script>

<div class="About">
	<h4>{$_('text.about.header')}</h4>
	<p>
		{$_('text.about.why')}
	</p>
	<p>
		{$_('text.about.concurrents')}
	</p>
	<p>
		{$_('text.about.website')}<a href="http://car-defects.com/">car-defects.com</a>, {$_(
			'text.about.website_details'
		)}
	</p>
	<p>{$_('text.about.project')}</p>
</div>

<style scoped>
	.About {
		padding: 15px;
	}
</style>
