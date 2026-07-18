import { asBoolean, asNumber, asObject, asString } from '../../../lib/normalize';
import type { MediaItem } from './types';

function asNullableString(value: unknown): string | null {
	const str = asString(value);
	return str ? str : null;
}

function asStringArray(value: unknown): string[] {
	if (!Array.isArray(value)) return [];
	return value.map((item) => asString(item)).filter(Boolean);
}

function asDetailDisplayPreset(value: unknown): 'vertical' | 'horizontal' | 'square' {
	const preset = asString(value).toLowerCase();
	return preset === 'vertical' || preset === 'horizontal' || preset === 'square' ? preset : 'square';
}

export function normalizeMediaItem(input: unknown): MediaItem {
	const data = asObject(input);

	return {
		id: asNullableString(data.id),
		file_key: asString(data.file_key),

		media_type: asString(data.media_type) || 'image',
		media_role: asString(data.media_role) || 'media_image',
		status: asString(data.status) || 'draft',
		is_featured: asBoolean(data.is_featured, false),

		file_path: asString(data.file_path),
		thumb_path: asNullableString(data.thumb_path),
		mime_type: asNullableString(data.mime_type),
		file_size: asNumber(data.file_size),
		width: asNumber(data.width),
		height: asNumber(data.height),

		collection: asNullableString(data.collection),
		category: asNullableString(data.category),
		slug: asNullableString(data.slug),
		sort_order: asNumber(data.sort_order),

		title: asNullableString(data.title),
		description: asNullableString(data.description),
		price: asNullableString(data.price),
		detail_display_preset: asDetailDisplayPreset(data.detail_display_preset),

		tags: asStringArray(data.tags),
		materials: asStringArray(data.materials),

		is_deleted: asBoolean(data.is_deleted, false),
		deleted_at: asNullableString(data.deleted_at),
		created_at: asNullableString(data.created_at),
		updated_at: asNullableString(data.updated_at),
	};
}
