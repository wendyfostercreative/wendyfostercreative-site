import type { AstroGlobal } from 'astro';

import { normalizeApiBase, resolveApiBaseUrl } from '../lib/api';


export function getSsrApiBaseUrl(Astro: AstroGlobal): string {
	const base = resolveApiBaseUrl(undefined);
	const normalized = normalizeApiBase(base);
	if (normalized) {
		if (normalized.startsWith('/')) return `${Astro.url.origin}${normalized}`;
		return normalized;
	}
	return `${Astro.url.origin}/api`;
}


export function forwardCookieHeaders(Astro: AstroGlobal): { cookie: string } {
	return {
		cookie: Astro.request.headers.get('cookie') ?? '',
	};
}
