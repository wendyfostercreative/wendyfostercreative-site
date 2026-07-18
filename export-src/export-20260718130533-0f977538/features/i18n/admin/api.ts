import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';
import { normalizeSiteProfile } from '../../siteProfile/core/normalize';
import type { SiteProfile } from '../../siteProfile/core/types';

export async function updateAdminLanguage(
	adminLocale: string,
	options: BaseOptions = {},
): Promise<SiteProfile> {
	const data = await apiFetch<unknown>('/admin/v1/i18n/language', {
		method: 'POST',
		body: JSON.stringify({ admin_locale: adminLocale }),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeSiteProfile(data);
}
