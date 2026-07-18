import { normalizeIntentText } from '../shared/text';

export function isSiteConfigIntent(text: string): boolean {
	const normalized = normalizeIntentText(text);
	return [
		'site config',
		'site identity',
		'site identity and theme',
		'identity and theme',
		'what about site config',
		'what do we need for site config',
		'next',
		'continue',
		'step 2',
		'step two',
	].includes(normalized);
}

export function isSeoDescriptionQuestion(text: string): boolean {
	const normalized = normalizeIntentText(text);
	return (
		(normalized.includes('what is') || normalized.includes('what s') || normalized.includes('whats')) &&
		(normalized.includes('search description') || normalized.includes('seo description'))
	);
}
