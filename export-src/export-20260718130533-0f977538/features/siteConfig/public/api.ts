import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { getExportSiteConfig, isExportSnapshotMode } from '../../export/data';
import { normalizeSiteConfig } from '../core/normalize';
import type { SiteConfig } from '../core/types';

export async function getSiteConfig(options: BaseOptions = {}): Promise<SiteConfig> {
	if (isExportSnapshotMode()) return getExportSiteConfig();

	const data = await apiFetch<unknown>('/public/v2/site-config', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeSiteConfig(data);
}
