import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';
import { normalizeSiteProfile } from '../core/normalize';
import type { SiteProfile } from '../core/types';

export async function getSiteProfile(options: BaseOptions = {}): Promise<SiteProfile> {
	const data = await apiFetch<unknown>('/public/v1/site-profile', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeSiteProfile(data);
}
