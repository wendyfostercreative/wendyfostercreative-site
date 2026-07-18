import type { MediaItem } from '../../core/types';
import type { ImageMediaViewItem } from './types';
import { imageMediaPublicHref } from './paths';

function isImageMedia(item: MediaItem | null | undefined): item is MediaItem {
	return Boolean(item && item.media_type === 'image');
}

export function toImageMediaViewItem(item: MediaItem): ImageMediaViewItem | null {
	if (!isImageMedia(item)) return null;

	return {
		file_key: item.file_key,
		title: item.title,
		description: item.description,
		price: item.price,
		detail_display_preset: item.detail_display_preset,
		collection: item.collection,
		category: item.category,
		slug: item.slug,
		file_path: item.file_path,
		thumb_path: item.thumb_path,
		public_href: imageMediaPublicHref(item),
		tags: Array.isArray(item.tags) ? item.tags : [],
		materials: Array.isArray(item.materials) ? item.materials : [],
	};
}

export function toImageMediaViewItems(items: MediaItem[]): ImageMediaViewItem[] {
	return (Array.isArray(items) ? items : [])
		.map((item) => toImageMediaViewItem(item))
		.filter((item): item is ImageMediaViewItem => Boolean(item));
}
