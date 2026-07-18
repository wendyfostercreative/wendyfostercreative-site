import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';
import { normalizeSiteProfile } from '../core/normalize';
import type { SiteProfile } from '../core/types';

export async function getAdminSiteProfile(options: BaseOptions = {}): Promise<SiteProfile> {
	const data = await apiFetch<unknown>('/admin/v1/site-profile', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeSiteProfile(data);
}

export async function updateAdminSiteProfile(
	payload: SiteProfile,
	options: BaseOptions = {},
): Promise<SiteProfile> {
	const data = await apiFetch<unknown>('/admin/v1/site-profile', {
		method: 'POST',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeSiteProfile(data);
}
