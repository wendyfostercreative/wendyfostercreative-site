export function asInputValue(el: Element | null): string {
	if (!el) return '';
	if ('value' in el) return String((el as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement).value ?? '');
	return '';
}

export function fieldValue(el: Element): string | boolean {
	if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.checked;
	return asInputValue(el);
}

export function setPath(target: Record<string, any>, path: string, value: unknown): void {
	const parts = path.split('.');
	let cursor = target;
	parts.slice(0, -1).forEach((part) => {
		if (!cursor[part] || typeof cursor[part] !== 'object') cursor[part] = {};
		cursor = cursor[part];
	});
	cursor[parts[parts.length - 1]] = value;
}
