export function humanizeToken(value: string): string {
	return value
		.trim()
		.replace(/[_-]+/g, ' ')
		.replace(/\s+/g, ' ')
		.replace(/\b\w/g, (character) => character.toUpperCase());
}

export function humanValueOrEmpty(value: string | null | undefined, empty: string): string {
	const compact = value?.trim() || '';
	return compact ? humanizeToken(compact) : empty;
}

export function humanListOrEmpty(values: string[], empty: string): string {
	const humanized = values.map(humanizeToken).filter(Boolean);
	return humanized.length ? humanized.join(', ') : empty;
}
