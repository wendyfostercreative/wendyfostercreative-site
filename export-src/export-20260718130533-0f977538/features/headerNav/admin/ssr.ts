import type { AstroGlobal } from 'astro';

import { forwardCookieHeaders, getSsrApiBaseUrl } from '../../../lib/ssr';

import { getAdminHeaderNavSettings } from './api';
import type { HeaderNavSettings } from '../core/types';


export async function loadAdminHeaderNavSettings(
	Astro: AstroGlobal,
): Promise<HeaderNavSettings> {
	return getAdminHeaderNavSettings({
		apiBaseUrl: getSsrApiBaseUrl(Astro),
		headers: forwardCookieHeaders(Astro),
	});
}