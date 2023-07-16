const chars = {
	а: 'a',
	б: 'b',
	в: 'v',
	г: 'g',
	д: 'd',
	е: 'e',
	ё: 'yo',
	ж: 'zh',
	з: 'z',
	и: 'i',
	й: 'y',
	к: 'k',
	л: 'l',
	м: 'm',
	н: 'n',
	о: 'o',
	п: 'p',
	р: 'r',
	с: 's',
	т: 't',
	у: 'u',
	ф: 'f',
	х: 'h',
	ц: 'c',
	ч: 'ch',
	ш: 'sh',
	щ: 'jsh',
	ъ: 'hh',
	ы: 'ih',
	ь: 'jh',
	э: 'eh',
	ю: 'yu',
	я: 'ya'
};

export const transpile = (s: string): string =>
	s
		.split('')
		.map((c) => chars[c] || c)
		.join('');
