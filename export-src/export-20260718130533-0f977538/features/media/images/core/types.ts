import type { MediaItem } from '../../core/types';

export type ImageMediaViewItem = {
	file_key: string;
	title: string | null;
	description: string | null;
	price: string | null;
	detail_display_preset: 'vertical' | 'horizontal' | 'square';
	collection: string | null;
	category: string | null;
	slug: string | null;
	file_path: string;
	thumb_path: string | null;
	public_href: string | null;
	tags: string[];
	materials: string[];
};

export type ImageMediaSourceItem = MediaItem & { media_type: 'image' | string };

export type ImageMediaItem = {
	id: string;
	file: string;
	webp: string;
	thumb: string;
	slug?: string | null;
	section?: string | null;
	collection?: string | null;
	category?: string | null;
	canonical_path?: string | null;
	updated_at?: string | null;
	title?: string | null;
	description?: string | null;
	price?: string | null;
	detail_display_preset?: 'vertical' | 'horizontal' | 'square';
	tags?: string[];
	materials?: string[];
	is_published?: boolean;
	is_featured?: boolean;
};

export type ImageMediaResponse = ImageMediaItem[];
