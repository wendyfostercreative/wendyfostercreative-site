import type { AstroGlobal } from 'astro';

import { getDefaultFooterSettings } from '../../features/footer/public/api';
import type { FooterSettings } from '../../features/footer/core/types';
import { loadAdminFooterSettings } from '../../features/footer/admin/ssr';
import { getDefaultHeaderNavSettings } from '../../features/headerNav/public/api';
import type { HeaderNavSettings, NavItem } from '../../features/headerNav/core/types';
import { loadAdminHeaderNavSettings } from '../../features/headerNav/admin/ssr';
import { loadAdminPages } from '../../features/pages/admin/ssr';
import { deriveNavItemsFromCmsPages } from '../../features/pages/public/deriveNavItems';
import { loadAdminSiteConfig } from '../../features/siteConfig/admin/ssr';
import type { SiteConfig } from '../../features/siteConfig/core/types';

export async function loadAdminLayoutConfig(
	Astro: AstroGlobal,
): Promise<{ site: SiteConfig; headerNav: HeaderNavSettings; footer: FooterSettings; navItems: NavItem[] }> {
	const site = await loadAdminSiteConfig(Astro);

	let headerNav: HeaderNavSettings;
	try {
		headerNav = await loadAdminHeaderNavSettings(Astro);
	} catch {
		headerNav = getDefaultHeaderNavSettings();
	}

	let footer: FooterSettings;
	try {
		footer = await loadAdminFooterSettings(Astro);
	} catch {
		footer = getDefaultFooterSettings();
	}

	let navItems: NavItem[] = [];
	try {
		navItems = deriveNavItemsFromCmsPages(await loadAdminPages(Astro));
	} catch {
		navItems = [];
	}

	return { site, headerNav, footer, navItems };
}
