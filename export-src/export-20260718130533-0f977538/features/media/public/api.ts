import { apiFetch } from '../../../lib/api';
import { getExportMedia, isExportSnapshotMode } from '../../export/data';
import { normalizeMediaItem } from '../core/normalize';
import type { MediaLabels, MediaResponse } from '../core/types';

type BaseOptions = {
	apiBaseUrl?: string;
	headers?: HeadersInit;
};

export type PublicMediaort = 'sort_order' | 'newest' | 'title';

export type GetMediaOptions = BaseOptions & {
	limit?: number;
	offset?: number;
	media_role?: string;
	collection?: string;
	category?: string;
	featured?: boolean;
	sort?: PublicMediaort;
};

function buildMediaQuery(options: GetMediaOptions): string {
	const params = new URLSearchParams();

	if (typeof options.limit === 'number') params.set('limit', String(options.limit));
	if (typeof options.offset === 'number') params.set('offset', String(options.offset));
	if (typeof options.media_role === 'string' && options.media_role.trim()) {
		params.set('media_role', options.media_role.trim());
	}
	if (typeof options.collection === 'string' && options.collection.trim()) {
		params.set('collection', options.collection.trim());
	}
	if (typeof options.category === 'string' && options.category.trim()) {
		params.set('category', options.category.trim());
	}
	if (typeof options.featured === 'boolean') params.set('featured', String(options.featured));
	if (typeof options.sort === 'string' && options.sort.trim()) {
		params.set('sort', options.sort.trim());
	}

	const query = params.toString();
	return query ? `?${query}` : '';
}

function getExportMediaResponse(options: GetMediaOptions = {}): MediaResponse {
	let items = getExportMedia();
	if (options.media_role) items = items.filter((item) => item.media_role === options.media_role);
	if (options.collection) items = items.filter((item) => item.collection === options.collection);
	if (options.category) items = items.filter((item) => item.category === options.category);
	if (typeof options.featured === 'boolean') items = items.filter((item) => item.is_featured === options.featured);
	if (options.sort === 'title') {
		items = [...items].sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
	} else if (options.sort === 'newest') {
		items = [...items].sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
	} else {
		items = [...items].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
	}
	const offset = typeof options.offset === 'number' ? options.offset : 0;
	const limit = typeof options.limit === 'number' ? options.limit : undefined;
	return typeof limit === 'number' ? items.slice(offset, offset + limit) : items.slice(offset);
}

export async function getMedia(options: GetMediaOptions = {}): Promise<MediaResponse> {
	if (isExportSnapshotMode()) return getExportMediaResponse(options);

	const qs = buildMediaQuery(options);
	const data = await apiFetch<{ items?: unknown[] }>(`/public/v1/media${qs}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map((item) => normalizeMediaItem(item)) : [];
}

type GetFeaturedMediaOptions = BaseOptions & {
	limit?: number;
};

export async function getFeaturedMedia(options: GetFeaturedMediaOptions = {}): Promise<MediaResponse> {
	if (isExportSnapshotMode()) return getExportMediaResponse({ ...options, featured: true });

	const limit = typeof options.limit === 'number' ? options.limit : undefined;
	const qs = typeof limit === 'number' ? `?limit=${encodeURIComponent(String(limit))}` : '';

	const data = await apiFetch<{ items?: unknown[] }>(`/public/v1/media/featured${qs}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map((item) => normalizeMediaItem(item)) : [];
}

export async function getMediaLabels(
	options: Pick<GetMediaOptions, 'apiBaseUrl' | 'headers' | 'media_role'> = {},
): Promise<MediaLabels> {
	const params = new URLSearchParams();
	if (typeof options.media_role === 'string' && options.media_role.trim()) {
		params.set('media_role', options.media_role.trim());
	}

	const qs = params.toString();
	const data = await apiFetch<Partial<MediaLabels>>(`/public/v1/media/labels${qs ? `?${qs}` : ''}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return {
		roles: Array.isArray(data.roles) ? data.roles : [],
		collections: Array.isArray(data.collections) ? data.collections : [],
		categories: Array.isArray(data.categories) ? data.categories : [],
	};
}
