export function normalizeIntentText(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function unique(values: string[]): string[] {
	return Array.from(new Set(values.filter(Boolean)));
}

export function stringValue(value: unknown): string {
	return typeof value === 'string' ? value : '';
}

export function listValue(value: unknown): string[] {
	if (Array.isArray(value)) return value.filter((item): item is string => typeof item === 'string' && Boolean(item));
	if (typeof value === 'string' && value.trim()) return [value.trim()];
	return [];
}
