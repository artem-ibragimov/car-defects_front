export const filterNullable = (o: Record<string, any | null | undefined>) => {
	return Object.fromEntries(
		Object.entries(o).filter(([_, v]) => v !== null && typeof v !== 'undefined')
	);
};
