import { apiFetch } from '../api';
import type { BaseOptions } from '../types';

export type AdminI18nMessages = {
	locale: string;
	fallback_locale: string;
	namespaces: string[];
	messages: Record<string, string>;
};

type Options = BaseOptions & {
	locale?: string | null;
	namespaces: string[];
};

export async function getAdminI18nMessages(options: Options): Promise<AdminI18nMessages> {
	const params = new URLSearchParams();
	params.set('namespaces', options.namespaces.join(','));
	if (options.locale) params.set('locale', options.locale);

	return await apiFetch<AdminI18nMessages>(`/admin/v1/i18n?${params.toString()}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
}
