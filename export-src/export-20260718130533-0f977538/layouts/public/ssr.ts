import type { AstroGlobal } from 'astro';

import { getSsrApiBaseUrl } from '../../lib/ssr';
import { getHeaderNavSettings, getDefaultHeaderNavSettings } from '../../features/headerNav/public/api';
import type { HeaderNavSettings, NavItem } from '../../features/headerNav/core/types';
import { getFooterSettings, getDefaultFooterSettings } from '../../features/footer/public/api';
import type { FooterSettings } from '../../features/footer/core/types';
import { getCmsPages } from '../../features/pages/public/api';
import { deriveNavItemsFromCmsPages } from '../../features/pages/public/deriveNavItems';
import { getSiteConfig } from '../../features/siteConfig/public/api';
import type { SiteConfig } from '../../features/siteConfig/core/types';

export async function loadSiteConfig(
	Astro: AstroGlobal,
): Promise<{ site: SiteConfig; headerNav: HeaderNavSettings; footer: FooterSettings; navItems: NavItem[] }> {
	const apiBaseUrl = getSsrApiBaseUrl(Astro);
	const site = await getSiteConfig({ apiBaseUrl });

	let headerNav: HeaderNavSettings;
	try {
		headerNav = await getHeaderNavSettings({ apiBaseUrl });
	} catch (error) {
		const endpoint = '/public/v1/header-nav';
		const requestedUrl = `${String(apiBaseUrl || '').replace(/\/+$/, '')}${endpoint}`;
		const maybeStatus =
			error && typeof error === 'object' && 'status' in error ? (error as { status?: unknown }).status : undefined;
		const maybeDetail =
			error && typeof error === 'object' && 'detail' in error ? (error as { detail?: unknown }).detail : undefined;

		console.error('[public header-nav] fetch failed', {
			apiBaseUrl,
			endpoint,
			requestedUrl,
			status: maybeStatus,
			detail: maybeDetail,
			error,
		});

		headerNav = getDefaultHeaderNavSettings();
	}

	let footer: FooterSettings;
	try {
		footer = await getFooterSettings({ apiBaseUrl });
	} catch (error) {
		const endpoint = '/public/v1/footer';
		const requestedUrl = `${String(apiBaseUrl || '').replace(/\/+$/, '')}${endpoint}`;
		const maybeStatus =
			error && typeof error === 'object' && 'status' in error ? (error as { status?: unknown }).status : undefined;
		const maybeDetail =
			error && typeof error === 'object' && 'detail' in error ? (error as { detail?: unknown }).detail : undefined;

		console.error('[public footer] fetch failed', {
			apiBaseUrl,
			endpoint,
			requestedUrl,
			status: maybeStatus,
			detail: maybeDetail,
			error,
		});

		footer = getDefaultFooterSettings();
	}

	let navItems: NavItem[] = [];
	try {
		const pages = await getCmsPages({ apiBaseUrl });
		navItems = deriveNavItemsFromCmsPages(pages);
	} catch {
		navItems = [];
	}

	return { site, headerNav, footer, navItems };
}
