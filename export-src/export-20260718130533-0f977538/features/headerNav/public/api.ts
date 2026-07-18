import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { getExportHeaderNav, isExportSnapshotMode } from '../../export/data';
import { DEFAULT_HEADER_NAV_SETTINGS } from '../core/defaults';
import { normalizeHeaderNavSettings } from '../core/normalize';
import type { HeaderNavSettings } from '../core/types';

export function getDefaultHeaderNavSettings(): HeaderNavSettings {
	return { ...DEFAULT_HEADER_NAV_SETTINGS };
}

export async function getHeaderNavSettings(options: BaseOptions = {}): Promise<HeaderNavSettings> {
	if (isExportSnapshotMode()) return getExportHeaderNav();

	const data = await apiFetch<unknown>('/public/v1/header-nav', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeHeaderNavSettings(data);
}
