export type AdminTranslator = (key: string, fallback: string) => string;

type NoticeKind = 'message' | 'error';

type NoticeParams = {
	key?: string;
	text?: string;
};

function appendNotice(path: string, kind: NoticeKind, params: NoticeParams): string {
	const separator = path.includes('?') ? '&' : '?';
	const search = new URLSearchParams();

	if (params.key) search.set(`${kind}_key`, params.key);
	if (params.text) search.set(kind, params.text);

	return `${path}${separator}${search.toString()}`;
}

export function redirectWithMessageKey(path: string, key: string): string {
	return appendNotice(path, 'message', { key });
}

export function redirectWithErrorKey(path: string, key: string): string {
	return appendNotice(path, 'error', { key });
}

export function redirectWithErrorText(path: string, text: string): string {
	return appendNotice(path, 'error', { text });
}

export function resolveAdminNotice(
	searchParams: URLSearchParams,
	t: AdminTranslator,
): { statusMessage: string; errorMessage: string } {
	const messageKey = String(searchParams.get('message_key') || '').trim();
	const errorKey = String(searchParams.get('error_key') || '').trim();
	const rawMessage = String(searchParams.get('message') || '').trim();
	const rawError = String(searchParams.get('error') || '').trim();

	return {
		statusMessage: messageKey ? t(messageKey, rawMessage) : rawMessage,
		errorMessage: errorKey ? t(errorKey, rawError) : rawError,
	};
}
