import { normalizeIntentText } from './text';

export function isConfirmationIntent(text: string): boolean {
	const normalized = normalizeIntentText(text);
	if (!normalized) return false;

	return [
		'yes',
		'yes looks good',
		'yes looks great',
		'yeah looks good',
		'yeah looks great',
		'looks good',
		'looks great',
		'that looks good',
		'that looks great',
		'that is right',
		'thats right',
		'that s right',
		'correct',
		'right',
		'ok',
		'okay',
		'go ahead',
		'save it',
		'save this',
		'apply it',
	].includes(normalized);
}
