import type { AstroGlobal } from 'astro';

import { getSsrApiBaseUrl } from '../../../../lib/ssr';

import { getFeaturedImages, getImageByPath, getImages } from './api';
import type { ImageMediaItem, ImageMediaResponse } from '../core/types';

export async function loadImages(Astro: AstroGlobal): Promise<ImageMediaResponse> {
	const data = await getImages({ apiBaseUrl: getSsrApiBaseUrl(Astro) });
	return Array.isArray(data) ? data : [];
}

export async function loadFeaturedImages(
	Astro: AstroGlobal,
	options: { limit?: number } = {},
): Promise<ImageMediaResponse> {
	const data = await getFeaturedImages({ apiBaseUrl: getSsrApiBaseUrl(Astro), limit: options.limit });
	return Array.isArray(data) ? data : [];
}

export async function loadImageByPath(
	Astro: AstroGlobal,
	options: { collection: string; category: string; slug: string },
): Promise<ImageMediaItem> {
	return await getImageByPath({
		collection: options.collection,
		category: options.category,
		slug: options.slug,
		apiBaseUrl: getSsrApiBaseUrl(Astro),
	});
}
