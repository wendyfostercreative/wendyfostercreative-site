import ImageGrid from './ImageGrid.astro';

import type { ImageGalleryLayout } from '../../schema/types';

export const imageGalleryLayoutRegistry = {
	grid: ImageGrid,
} satisfies Record<ImageGalleryLayout, typeof ImageGrid>;
