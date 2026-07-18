import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { normalizeHeaderNavSettings } from '../core/normalize';
import type { HeaderNavSettings } from '../core/types';
import type { HeaderNavUpdatePayload } from './forms/headerNavForm';

export async function getAdminHeaderNavSettings(
	options: BaseOptions = {},
): Promise<HeaderNavSettings> {
	const data = await apiFetch<unknown>('/admin/v1/header-nav', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeHeaderNavSettings(data);
}

export async function updateAdminHeaderNavSettings(
	payload: HeaderNavUpdatePayload,
	options: BaseOptions = {},
): Promise<HeaderNavSettings> {
	const data = await apiFetch<unknown>('/admin/v1/header-nav', {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeHeaderNavSettings(data);
}
