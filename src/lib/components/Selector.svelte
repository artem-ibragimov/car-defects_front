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

<div class="pure-menu" class:pure-menu-horizontal={!column} {hidden}>
	<ul class="pure-menu-list">
		{#each variants as v}
			<li
				class="pure-menu-item"
				class:pure-menu-disabled={disabled}
				class:pure-menu-selected={v.selected && !v.color}
				class:pure-menu-item-colorful={!!v.color}
				style={`${v.selected && v.color ? 'border-color:' + v.color : ''}`}
				on:click={disabled ? null : () => onclick(v.value)}
			>
				<span class="pure-menu-link">
					{#if v.icon}
						<img src={v.icon} alt={v.label || v.value} width="24" height="16" />
					{:else}
						{$_(v.label || v.value)}{/if}
				</span>
			</li>
		{/each}
		{#if needApplyButton && variants.length !== 0}
			<Button
				stretch_desktop={column}
				variant={isApplied ? 'secondary' : 'success'}
				on:click={() => apply()}
				>{appendLabel ? appendLabel : isApplied ? $_('label.applied') : $_('label.apply')}
			</Button>
		{/if}
		{#if needResetButton && variants.length !== 0}
			<Button on:click={reset}>{$_('label.reset')}</Button>
		{/if}
	</ul>
</div>

<style scoped>
	.pure-menu-horizontal {
		white-space: normal;
		width: auto;
	}
	.pure-menu {
		cursor: pointer;
	}
	.pure-menu-link {
		box-sizing: border-box;
		transition: all 0.3s;
		background-color: inherit;
	}
	.pure-menu-link:hover {
		color: #000;
		background-color: #fff;
	}
	.pure-menu-item {
		text-transform: capitalize;
		box-sizing: border-box;
		user-select: none;
	}
	.pure-menu-item-colorful {
		border: 4px solid;
		border-color: transparent;
		transition: border-color 0.5s;
	}
	.pure-menu-item.pure-menu-selected .pure-menu-link {
		border-bottom: 1px solid #b5caac;
		background-color: #d6eecb;
	}

	@media (max-width: 500px) {
		.pure-menu-list {
			display: flex;
			flex-wrap: wrap;
			align-items: stretch;
		}
		.pure-menu-item {
			flex: 1;
		}
		.pure-menu-horizontal .pure-menu-item {
			display: block;
		}
	}
</style>
