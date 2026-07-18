import type { AstroGlobal } from 'astro';

import { getSsrApiBaseUrl } from '../../../lib/ssr';
import { getSiteConfig } from '../../siteConfig/public/api';
import { getCmsPageByPath, getCmsPages } from './api';
import type { CmsPage } from '../core/types';
import type { SiteConfig } from '../../siteConfig/core/types';


export async function loadCmsPages(Astro: AstroGlobal): Promise<CmsPage[]> {
	return await getCmsPages({ apiBaseUrl: getSsrApiBaseUrl(Astro) });
}

export async function loadPage(Astro: AstroGlobal, path: string): Promise<CmsPage> {
	return await getCmsPageByPath(path, { apiBaseUrl: getSsrApiBaseUrl(Astro) });
}

export async function loadSiteConfig(Astro: AstroGlobal): Promise<SiteConfig> {
	return await getSiteConfig({ apiBaseUrl: getSsrApiBaseUrl(Astro) });
}
