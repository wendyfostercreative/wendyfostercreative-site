import type { AstroGlobal } from 'astro';

import { getAdminSiteProfile } from '../../features/siteProfile/admin/api';
import type { SiteProfile } from '../../features/siteProfile/core/types';
import { getSsrApiBaseUrl, forwardCookieHeaders } from '../ssr';
import { getAdminI18nMessages } from './i18n';

export type AdminContext = {
	apiBaseUrl: string;
	headers: { cookie: string };
	profile: SiteProfile | null;
	profileError: string;
	locale: string;
	fallbackLocale: string;
	messages: Record<string, string>;
	t: (key: string, fallback: string) => string;
	tf: (key: string, fallback: string, values: Record<string, string | number>) => string;
};

export async function loadAdminContext(
	Astro: AstroGlobal,
	namespaces: string[],
): Promise<AdminContext> {
	const apiBaseUrl = getSsrApiBaseUrl(Astro);
	const headers = forwardCookieHeaders(Astro);
	const localeOverride = Astro.url.searchParams.get('locale');
	let profile: SiteProfile | null = null;
	let profileError = '';
	let locale = localeOverride || '';
	let fallbackLocale = 'en';
	let messages: Record<string, string> = {};

	try {
		profile = await getAdminSiteProfile({ apiBaseUrl, headers });
		locale = localeOverride || profile.localization.admin_locale || locale;
		fallbackLocale = profile.localization.fallback_locale || fallbackLocale;
	} catch (error) {
		profileError = error instanceof Error ? error.message : 'Could not load site profile.';
		locale = localeOverride || locale;
	}

	try {
		const i18n = await getAdminI18nMessages({
			apiBaseUrl,
			headers,
			locale,
			namespaces,
		});
		locale = i18n.locale;
		fallbackLocale = i18n.fallback_locale;
		messages = i18n.messages;
	} catch {
		messages = {};
	}

	function t(key: string, fallback: string): string {
		return messages[key] || fallback;
	}

	function tf(key: string, fallback: string, values: Record<string, string | number>): string {
		return t(key, fallback).replace(/\{([a-zA-Z0-9_]+)\}/g, (_, token: string) => {
			const value = values[token];
			return value === undefined ? `{${token}}` : String(value);
		});
	}

	return {
		apiBaseUrl,
		headers,
		profile,
		profileError,
		locale,
		fallbackLocale,
		messages,
		t,
		tf,
	};
}
