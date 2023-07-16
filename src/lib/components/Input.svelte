<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	export let lower = false;
	export let disabled = false;
	export let type: string = 'text';
	export let value: string | number = type.match(/^(number|range)$/) ? 0 : '';
	export let label: string = '';
	export let min: string = '0';
	export let max: string = '10000';
	export let placeholder: string = '';
	export let suggestions: any[] = [];
	export let hidden = false;
	export let focused = false;
	export let hideOnSuggestionClick = true;

	let input_id = `input_${Math.random()}`;

	const dispatcher = createEventDispatcher();

	let root: HTMLDivElement = null;
	let field: HTMLDivElement = null;
	let input: HTMLInputElement = null;

	$: isOpen = false;
	const show = () => {
		isOpen = suggestions.length !== 0;
	};
	const hide = () => {
		focused = false;
		isOpen = false;
	};
	$: hidden && hide();
	const handleInput = (e) => {
		value = type.match(/^(number|range)$/)
			? +e.target.value
			: lower
			? e.target.value.toLowerCase()
			: e.target.value;
		show();
		dispatcher('input', value);
	};

	const onSuggestionClick = (item) => {
		value = item;
		hide();
	};

	let dropdown_style = { width: '100%', left: '', top: '' };

	const setDropDownPosition = () => {
		if (!field) {
			return;
		}
		const rect = field.getBoundingClientRect();
		dropdown_style.width = `${Math.round(rect.width)}px`;
		dropdown_style.left = `${Math.round(rect.left + scrollX)}px`;
		dropdown_style.top = `${Math.round(rect.top + rect.height + scrollY)}px`;
	};

	const onDocumentClick = (e) => {
		if (isOpen && root && !root.contains(e.target)) {
			hide();
		}
	};
	onMount(() => {
		document.body.addEventListener('click', onDocumentClick);
		setDropDownPosition();
		return () => {
			document.body.removeEventListener('click', onDocumentClick);
		};
	});
</script>

<div class="Input" bind:this={root}>
	<div bind:this={field} class="Input__field">
		{#if label}
			<label for={input_id}>{label}</label>
		{/if}
		<input
			bind:this={input}
			{disabled}
			id={input_id}
			{type}
			{value}
			{placeholder}
			{min}
			{max}
			on:blur={() => {
				focused && input.focus();
			}}
			on:focus={() => {
				!isOpen && Promise.resolve(setDropDownPosition()).then(show);
			}}
			on:focus
			on:input={handleInput}
			on:change
		/>
	</div>
	<div
		class="Input__dropdown"
		class:Input__dropdown-opened={isOpen}
		on:click={hideOnSuggestionClick ? hide : null}
		style={`
         width: ${dropdown_style.width}; 
         left:  ${dropdown_style.left};
         top:   ${dropdown_style.top};
      `}
	>
		{#each suggestions as item}
			{#if $$slots['suggestion_item']}
				<slot name="suggestion_item" {item} class="Input__dropdown__item" />
			{/if}
			{#if !$$slots['suggestion_item']}
				<div
					class="Input__dropdown__item"
					on:click={() => {
						onSuggestionClick(item);
					}}
				>
					{item}
				</div>
			{/if}
		{/each}
	</div>
</div>

<style scoped>
	.Input {
		flex: 1;
	}
	.Input__field {
		flex: 1;
		box-sizing: border-box;
		display: flex;
	}
	.Input__field input {
		flex: 1;
		outline: none;
		text-transform: capitalize;
		box-sizing: border-box;
		margin: 0;
	}
	.Input__dropdown {
		overflow-y: scroll;
		max-height: 200px;
		flex-direction: column;
		position: absolute;
		border-radius: 6px;
		z-index: 9999999;
		display: none;
		cursor: pointer;
		text-transform: capitalize;
		background: #fff;
	}
	.Input__dropdown-opened {
		display: flex;
	}
	:global([slot='suggestion_item']),
	.Input__dropdown__item {
		display: inline-flex;
		justify-content: space-between;
		padding: 0.5em 0.6em;
		border: 1px solid #ccc;
		border-radius: 4px;
		vertical-align: middle;
		box-sizing: border-box;
		-webkit-appearance: textfield;
		outline-offset: -2px;
	}
	:global([slot='suggestion_item']) :hover,
	.Input__dropdown__item:hover {
		-webkit-box-shadow: inset 0 1px 3px #ddd;
		box-shadow: inset 0 1px 3px #ddd;
	}
</style>
