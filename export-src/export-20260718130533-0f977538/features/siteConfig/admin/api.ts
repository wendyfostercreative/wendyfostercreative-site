import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';
import { normalizeSiteConfig } from '../core/normalize';
import type { SiteConfig } from '../core/types';

export async function getAdminSiteConfig(options: BaseOptions = {}): Promise<SiteConfig> {
	const data = await apiFetch<unknown>('/admin/v2/site-config', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeSiteConfig(data);
}

export async function updateAdminSiteConfig(
	payload: SiteConfig,
	options: BaseOptions = {},
): Promise<SiteConfig> {
	const data = await apiFetch<unknown>('/admin/v2/site-config', {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeSiteConfig(data);
}

export async function patchAdminSiteConfig(
	payload: Partial<SiteConfig>,
	options: BaseOptions = {},
): Promise<SiteConfig> {
	const data = await apiFetch<unknown>('/admin/v2/site-config', {
		method: 'PATCH',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeSiteConfig(data);
}
