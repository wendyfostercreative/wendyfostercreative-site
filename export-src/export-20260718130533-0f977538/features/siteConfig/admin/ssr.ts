import type { AstroGlobal } from 'astro';

import { forwardCookieHeaders, getSsrApiBaseUrl } from '../../../lib/ssr';
import { getAdminSiteConfig } from './api';
import type { SiteConfig } from '../core/types';

export async function loadAdminSiteConfig(Astro: AstroGlobal): Promise<SiteConfig> {
	return await getAdminSiteConfig({
		apiBaseUrl: getSsrApiBaseUrl(Astro),
		headers: forwardCookieHeaders(Astro),
	});
}
