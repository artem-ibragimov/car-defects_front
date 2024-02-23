<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { _ } from 'svelte-i18n';
	import Button from './Button.svelte';
	export let variants: {
		label?: string;
		selected?: boolean;
		value: string;
		color?: string;
		icon?: string;
	}[] = [];
	export let multiselect: boolean = false;
	$: className = multiselect ? 'checkbox' : 'toggle toggle-info';
	export let column: boolean = false;
	export let needApplyButton = false;
	export let applyButtonLabel = $_('label.apply');
	export let disabled = false;
	export let hidden = false;

	let isApplied = true;

	$: if (multiselect && variants.every((v) => !v.selected)) {
		variants = variants.map((v) => ({ ...v, selected: true }));
	}

	const dispatch = createEventDispatcher();
	const selectOne = (value: string) => {
		isApplied = false;
		variants = variants.map((v) => ({
			...v,
			selected: v.value === value
		}));
		!needApplyButton && apply();
	};
	const onselect = multiselect
		? (value: string) => {
				isApplied = false;
				variants = variants.map((v) =>
					v.value === value
						? {
								...v,
								selected: v.value === value && !v.selected
							}
						: v
				);
				!needApplyButton && apply();
			}
		: selectOne;

	const apply = () => {
		dispatch('select', Object.fromEntries(variants.map((v) => [v.value, v.selected])));
		isApplied = true;
	};
</script>

{#if variants.length !== 0}
	<div class="join" class:join-vertical={column} class:join-horizontal={!column} {hidden}>
		{#each variants as v}
			<label class="label gap-4 cursor-pointer join-item">
				<span class="label-text">{$_(v.label || v.value)}</span>
				<input
					style={v.color && v.selected ? `background: ${v.color}` : ''}
					type="checkbox"
					checked={v.selected}
					class={className}
					on:change={disabled ? null : () => onselect(v.value)}
				/>
			</label>
		{/each}
		{#if needApplyButton}
			<Button variant="neutral" outline on:click={apply}>{applyButtonLabel}</Button>
		{/if}
	</div>
{/if}

<style scoped>
	.label {
		text-transform: capitalize;
		box-sizing: border-box;
		user-select: none;
		text-align: center;
	}
</style>
