import { apiFetch } from '../../../../lib/api';
import type { BaseOptions } from '../../../../lib/types';

import { getExportMedia, isExportSnapshotMode } from '../../../export/data';
import { normalizeMediaItem } from '../../core/normalize';
import type { ImageMediaItem, ImageMediaResponse } from '../core/types';


type GetFeaturedImagesOptions = BaseOptions & {
	limit?: number;
};

function imagePathFileName(path: string): string {
	const clean = String(path || '').split('?')[0] || '';
	return clean.split('/').filter(Boolean).pop() || clean;
}

export function mediaToImageMediaItem(input: unknown): ImageMediaItem {
	const media = normalizeMediaItem(input);
	const file = media.file_key || imagePathFileName(media.file_path);
	const collection = media.collection || null;
	const slug = media.slug || null;
	const category = media.category || null;

	return {
		id: media.id || media.file_key,
		file,
		webp: media.file_path,
		thumb: media.thumb_path || media.file_path,
		slug,
		section: collection,
		collection,
		category,
		canonical_path: collection && category && slug
			? `/${encodeURIComponent(collection)}/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`
			: null,
		updated_at: media.updated_at,
		title: media.title,
		description: media.description,
		price: media.price,
		detail_display_preset: media.detail_display_preset,
		tags: media.tags,
		materials: media.materials,
		is_published: media.status === 'published',
		is_featured: media.is_featured,
	};
}

export async function getFeaturedImages(options: GetFeaturedImagesOptions = {}): Promise<ImageMediaResponse> {
	if (isExportSnapshotMode()) {
		const limit = typeof options.limit === 'number' ? options.limit : undefined;
		const items = getExportMedia()
			.filter((item) => item.media_type === 'image' && item.is_featured)
			.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
			.map(mediaToImageMediaItem);
		return typeof limit === 'number' ? items.slice(0, limit) : items;
	}

	const limit = typeof options.limit === 'number' ? options.limit : undefined;
	const qs = typeof limit === 'number' ? `?limit=${encodeURIComponent(String(limit))}` : '';

	const data = await apiFetch<{ items?: unknown[] }>(`/public/v1/media/featured${qs}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map(mediaToImageMediaItem) : [];
}

export async function getImages(options: BaseOptions = {}): Promise<ImageMediaResponse> {
	if (isExportSnapshotMode()) {
		return getExportMedia()
			.filter((item) => item.media_type === 'image')
			.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
			.map(mediaToImageMediaItem);
	}

	const data = await apiFetch<{ items?: unknown[] }>('/public/v1/media', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map(mediaToImageMediaItem) : [];
}

type GetImageByPathOptions = BaseOptions & {
	collection: string;
	category: string;
	slug: string;
};

export async function getImageByPath(options: GetImageByPathOptions): Promise<ImageMediaItem> {
	const items = await getImages({
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
	const match = items.find((item) =>
		String(item.collection || item.section || '') === options.collection &&
		String(item.category || '') === options.category &&
		String(item.slug || '') === options.slug
	);
	if (!match) throw new Error('Image not found.');
	return match;
}
