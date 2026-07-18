import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { getExportPageByPath, getExportPages, isExportSnapshotMode } from '../../export/data';
import { normalizeCmsPage } from '../core/normalize';
import { normalizeCmsPagePath } from '../core/pagePaths';
import type { CmsPage } from '../core/types';

export async function getCmsPages(options: BaseOptions = {}): Promise<CmsPage[]> {
	if (isExportSnapshotMode()) return getExportPages();

	const data = await apiFetch<{ items?: unknown[] }>('/public/v1/pages', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map((item) => normalizeCmsPage(item)) : [];
}

export async function getCmsPageByPath(path: string, options: BaseOptions = {}): Promise<CmsPage> {
	if (isExportSnapshotMode()) return getExportPageByPath(path);

	const qs = `?path=${encodeURIComponent(normalizeCmsPagePath(path))}`;
	const data = await apiFetch<{ page?: unknown }>(`/public/v1/pages/by-path${qs}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeCmsPage(data.page);
}
