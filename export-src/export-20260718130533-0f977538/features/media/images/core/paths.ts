import type { MediaItem } from '../../core/types';

const IMAGE_MEDIA_PREFIX = '/media/media/images/';

function safeSegment(value: string): string {
	return encodeURIComponent(value.trim());
}

function isAbsoluteUrl(value: string): boolean {
	return value.startsWith('http://') || value.startsWith('https://');
}

function normalizeImageMediaPath(path: string): string {
	const value = String(path || '').trim();
	if (!value) return '';
	if (isAbsoluteUrl(value)) return value;
	if (value.startsWith('/')) return value;
	if (value.startsWith('media/media/images/')) return `/${value}`;
	if (value.startsWith('media/images/')) return `/media/${value}`;
	return `${IMAGE_MEDIA_PREFIX}${value.replace(/^\/+/, '')}`;
}

export function imageMediaPublicHref(
	item: Pick<MediaItem, 'collection' | 'category' | 'slug'>,
): string | null {
	const collection = typeof item.collection === 'string' ? item.collection.trim() : '';
	const category = typeof item.category === 'string' ? item.category.trim() : '';
	const slug = typeof item.slug === 'string' ? item.slug.trim() : '';

	if (!collection || !category || !slug) return null;
	return `/${safeSegment(collection)}/${safeSegment(category)}/${safeSegment(slug)}`;
}

export function resolvePreviewSrc(path: string): string {
	return normalizeImageMediaPath(path);
}

export function resolveCmsImageSrc(path: string): string {
	return normalizeImageMediaPath(path);
}
