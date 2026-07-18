export type MediaItem = {
	id: string | null;
	file_key: string;

	media_type: string;
	media_role: string;
	status: string;
	is_featured: boolean;

	file_path: string;
	thumb_path: string | null;
	mime_type: string | null;
	file_size: number | null;
	width: number | null;
	height: number | null;

	collection: string | null;
	category: string | null;
	slug: string | null;
	sort_order: number | null;

	title: string | null;
	description: string | null;
	price: string | null;
	detail_display_preset: 'vertical' | 'horizontal' | 'square';

	tags: string[];
	materials: string[];

	is_deleted: boolean;
	deleted_at: string | null;
	created_at: string | null;
	updated_at: string | null;
};

export type MediaResponse = MediaItem[];

export type MediaLabelItem = {
	value: string;
	label: string;
	count: number;
	collection: string | null;
};

export type MediaLabels = {
	roles: MediaLabelItem[];
	collections: MediaLabelItem[];
	categories: MediaLabelItem[];
};

export type AdminMediaImageItem = {
	id: number | string;
	file: string;
	webp: string;
	thumb: string;
	slug?: string | null;
	section?: string | null;
	collection?: string | null;
	category?: string | null;
	canonical_path?: string | null;
	media_role?: string | null;
	width?: number | null;
	height?: number | null;
	mime_type?: string | null;
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

export type AdminMediaImagesResponse = AdminMediaImageItem[];

export type AdminContentMediaListItem = {
	id: number;
	file_key: string;
	title: string;
	description: string;
	webp_path: string;
	thumb_path: string;
	created_at?: string;
	updated_at?: string;
};

export type AdminContentMediaUploadResponse = AdminContentMediaListItem;
