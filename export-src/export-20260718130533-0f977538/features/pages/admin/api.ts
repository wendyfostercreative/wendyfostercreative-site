import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { normalizeCmsPage } from '../core/normalize';
import type { CmsPage } from '../core/types';

export async function getAdminPages(options: BaseOptions = {}): Promise<CmsPage[]> {
	const data = await apiFetch<{ items?: unknown[] }>('/admin/v1/pages', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map((item) => normalizeCmsPage(item)) : [];
}

export async function getAdminPage(id: number, options: BaseOptions = {}): Promise<CmsPage> {
	const data = await apiFetch<{ page?: unknown }>(`/admin/v1/pages/${encodeURIComponent(String(id))}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeCmsPage(data.page);
}

export async function createAdminPage(
	page: Omit<CmsPage, 'id' | 'created_at' | 'updated_at'>,
	options: BaseOptions = {},
): Promise<CmsPage> {
	const data = await apiFetch<{ page?: unknown }>('/admin/v1/pages', {
		method: 'POST',
		apiBaseUrl: options.apiBaseUrl,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
		body: JSON.stringify(page),
	});

	return normalizeCmsPage(data.page);
}

export async function updateAdminPage(
	id: number,
	page: Record<string, unknown>,
	options: BaseOptions = {},
): Promise<CmsPage> {
	const data = await apiFetch<{ page?: unknown }>(`/admin/v1/pages/${encodeURIComponent(String(id))}`, {
		method: 'PATCH',
		apiBaseUrl: options.apiBaseUrl,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
		body: JSON.stringify(page),
	});

	return normalizeCmsPage(data.page);
}

export async function deleteAdminPage(id: number, options: BaseOptions = {}): Promise<void> {
	await apiFetch(`/admin/v1/pages/${encodeURIComponent(String(id))}`, {
		method: 'DELETE',
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
}
