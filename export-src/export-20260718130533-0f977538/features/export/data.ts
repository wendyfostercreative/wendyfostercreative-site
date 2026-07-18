import { normalizeMediaItem } from '../media/core/normalize';
import type { MediaItem } from '../media/core/types';
import { normalizeCmsPagePath } from '../pages/core/pagePaths';
import { normalizeCmsPage } from '../pages/core/normalize';
import type { CmsPage } from '../pages/core/types';
import { normalizeSiteConfig } from '../siteConfig/core/normalize';
import type { SiteConfig } from '../siteConfig/core/types';
import { normalizeHeaderNavSettings } from '../headerNav/core/normalize';
import type { HeaderNavSettings } from '../headerNav/core/types';
import { normalizeFooterSettings } from '../footer/core/normalize';
import type { FooterSettings } from '../footer/core/types';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type SnapshotSite = {
	site_profile?: unknown;
	site_config?: unknown;
	header_nav?: unknown;
	footer?: unknown;
};

type SnapshotCollection = {
	items?: unknown[];
};

export function isExportSnapshotMode(): boolean {
	return Boolean(process.env.CMS_EXPORT_SNAPSHOT_DIR);
}

function snapshotDir(): string {
	const dir = process.env.CMS_EXPORT_SNAPSHOT_DIR;
	if (!dir) throw new Error('CMS_EXPORT_SNAPSHOT_DIR is not set.');
	return dir;
}

function readJson<T>(name: string): T {
	return JSON.parse(readFileSync(join(snapshotDir(), name), 'utf-8')) as T;
}

export function getExportSiteSnapshot(): SnapshotSite {
	return readJson<SnapshotSite>('site.json');
}

export function getExportPages(): CmsPage[] {
	const data = readJson<SnapshotCollection>('pages.json');
	return Array.isArray(data.items) ? data.items.map((item) => normalizeCmsPage(item)) : [];
}

export function getExportPageByPath(path: string): CmsPage {
	const normalizedPath = normalizeCmsPagePath(path);
	const page = getExportPages().find((item) => normalizeCmsPagePath(item.path) === normalizedPath);
	if (!page) throw new Error(`Export snapshot page not found: ${normalizedPath}`);
	return page;
}

export function getExportMedia(): MediaItem[] {
	const data = readJson<SnapshotCollection>('media.json');
	return Array.isArray(data.items) ? data.items.map((item) => normalizeMediaItem(item)) : [];
}

export function getExportSiteConfig(): SiteConfig {
	return normalizeSiteConfig(getExportSiteSnapshot().site_config);
}

export function getExportHeaderNav(): HeaderNavSettings {
	return normalizeHeaderNavSettings(getExportSiteSnapshot().header_nav);
}

export function getExportFooter(): FooterSettings {
	return normalizeFooterSettings(getExportSiteSnapshot().footer);
}

export function getExportPublicPagePaths(): string[] {
	return getExportPages()
		.map((page) => normalizeCmsPagePath(page.path))
		.filter((path) => path !== '/');
}

export function getExportMediaCategoryRoutes(): Array<{ collection: string; category: string }> {
	const seen = new Set<string>();
	const routes: Array<{ collection: string; category: string }> = [];
	for (const item of getExportMedia()) {
		const collection = String(item.collection || '').trim();
		const category = String(item.category || '').trim();
		if (!collection || !category) continue;
		const key = `${collection}\n${category}`;
		if (seen.has(key)) continue;
		seen.add(key);
		routes.push({ collection, category });
	}
	return routes;
}

export function getExportMediaDetailRoutes(): Array<{ collection: string; category: string; slug: string }> {
	const seen = new Set<string>();
	const routes: Array<{ collection: string; category: string; slug: string }> = [];
	for (const item of getExportMedia()) {
		const collection = String(item.collection || '').trim();
		const category = String(item.category || '').trim();
		const slug = String(item.slug || '').trim();
		if (!collection || !category || !slug) continue;
		const key = `${collection}\n${category}\n${slug}`;
		if (seen.has(key)) continue;
		seen.add(key);
		routes.push({ collection, category, slug });
	}
	return routes;
}
