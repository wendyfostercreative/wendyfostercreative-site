import type { ImageGalleryLayout } from './schema/types';

export const IMAGE_GALLERY_LAYOUT_VALUES = ['grid'] as const satisfies readonly ImageGalleryLayout[];

export const IMAGE_GALLERY_LAYOUT_OPTIONS: { value: ImageGalleryLayout; label: string; description: string }[] = [
	{ value: 'grid', label: 'Grid', description: 'Even image cards in a responsive gallery grid.' },
];

export function isImageGalleryLayout(value: unknown): value is ImageGalleryLayout {
	return typeof value === 'string' && IMAGE_GALLERY_LAYOUT_VALUES.includes(value as ImageGalleryLayout);
}

export function resolveImageGalleryLayout(value: unknown): ImageGalleryLayout {
	return isImageGalleryLayout(value) ? value : 'grid';
}
