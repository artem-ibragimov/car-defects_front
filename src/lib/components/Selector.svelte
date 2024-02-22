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
	$: type = multiselect ? 'checkbox' : 'radio';
	export let column: boolean = false;
	export let needApplyButton = false;
	export let disabled = false;
	export let needResetButton = false;
	export let appendLabel = '';
	export let hidden = false;

	let isApplied = true;
	let isRecentlyClicked = false;
	let prevVal;
	let timeoutID;

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

	const onclick = (v: string) => {
		if (isRecentlyClicked && v === prevVal) {
			clearTimeout(timeoutID);
			selectOne(v);
			return;
		}
		prevVal = v;
		isRecentlyClicked = true;
		timeoutID = setTimeout(function () {
			isRecentlyClicked = false;
			onselect(v);
		}, 300);
	};
	const apply = () => {
		dispatch('select', Object.fromEntries(variants.map((v) => [v.value, v.selected])));
		isApplied = true;
	};
	const reset = () => {
		dispatch('reset');
	};
</script>

{#if variants.length !== 0}
	<div class="join" class:join-vertical={column} class:join-horizontal={!column} {hidden}>
		{#each variants as v}
			<label class="label gap-4 cursor-pointer join-item">
				<span class="label-text">{$_(v.label || v.value)}</span>
				<input
					style={v.color && v.selected ? `background: ${v.color}` : ''}
					{type}
					checked={v.selected}
					class={type}
					on:change={disabled ? null : () => onclick(v.value)}
				/>
			</label>
		{/each}
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
