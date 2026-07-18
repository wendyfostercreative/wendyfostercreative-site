import type { AstroGlobal } from 'astro';

import { forwardCookieHeaders, getSsrApiBaseUrl } from '../../../lib/ssr';

import { getAdminFooterSettings } from './api';
import type { FooterSettings } from '../core/types';

export async function loadAdminFooterSettings(
	Astro: AstroGlobal,
): Promise<FooterSettings> {
	return getAdminFooterSettings({
		apiBaseUrl: getSsrApiBaseUrl(Astro),
		headers: forwardCookieHeaders(Astro),
	});
}
