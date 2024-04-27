import type { ArgumentsType } from 'vitest';

export const filterNullable = (o: Record<string, any | null | undefined>) => {
	return Object.fromEntries(
		Object.entries(o).filter(([_, v]) => v !== null && typeof v !== 'undefined')
	);
};

export const debounce = <T extends (...args: any) => any>(f: T, interval = 500) => {
	let expired = true;
	let args: ArgumentsType<T>;
	let state = '';
	const reset = () => {
		expired = true;
		f(args);
	};
	return (...params: ArgumentsType<T>): ReturnType<T> | void => {
		args = params;
		let s = JSON.stringify(params);
		if (!expired || s === state) {
			return;
		}
		state = s;
		expired = false;
		setTimeout(reset, interval);
	};
};
