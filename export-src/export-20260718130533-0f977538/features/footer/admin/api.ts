import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { normalizeFooterSettings } from '../core/normalize';
import type { FooterSettings } from '../core/types';
import type { FooterUpdatePayload } from './forms/footerForm';

export async function getAdminFooterSettings(
	options: BaseOptions = {},
): Promise<FooterSettings> {
	const data = await apiFetch<unknown>('/admin/v1/footer', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeFooterSettings(data);
}

export async function updateAdminFooterSettings(
	payload: FooterUpdatePayload,
	options: BaseOptions = {},
): Promise<FooterSettings> {
	const data = await apiFetch<unknown>('/admin/v1/footer', {
		method: 'PUT',
		body: JSON.stringify(payload),
		headers: {
			'Content-Type': 'application/json',
			...(options.headers ?? {}),
		},
		apiBaseUrl: options.apiBaseUrl,
	});

	return normalizeFooterSettings(data);
}
