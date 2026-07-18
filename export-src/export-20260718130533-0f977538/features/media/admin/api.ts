import { apiFetch } from '../../../lib/api';
import { normalizeMediaItem } from '../core/normalize';
import type {
	AdminMediaImageItem,
	AdminMediaImagesResponse,
	AdminContentMediaListItem,
	AdminContentMediaUploadResponse,
	MediaItem,
	MediaLabels,
	MediaResponse,
} from '../core/types';

type BaseOptions = {
	apiBaseUrl?: string;
	headers?: HeadersInit;
};

function mediaToAdminImageItem(input: unknown): AdminMediaImageItem {
	const media = normalizeMediaItem(input);
	const section = media.collection || null;
	const category = media.category || null;
	const slug = media.slug || null;

	return {
		id: media.id || media.file_key,
		file: media.file_key,
		webp: media.file_path,
		thumb: media.thumb_path || media.file_path,
		slug,
		section,
		collection: media.collection,
		category,
		media_role: media.media_role,
		width: media.width,
		height: media.height,
		mime_type: media.mime_type,
		canonical_path: section && category && slug
			? `/${encodeURIComponent(section)}/${encodeURIComponent(category)}/${encodeURIComponent(slug)}`
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

function mediaToContentMediaItem(input: unknown): AdminContentMediaListItem {
	const media = normalizeMediaItem(input);

	return {
		id: Number(media.id) || 0,
		file_key: media.file_key,
		title: media.title || media.file_key,
		description: media.description || '',
		webp_path: media.file_path,
		thumb_path: media.thumb_path || media.file_path,
		created_at: media.created_at || undefined,
		updated_at: media.updated_at || undefined,
	};
}

export async function getAdminMedia(
	options: BaseOptions & { media_role?: string } = {},
): Promise<MediaResponse> {
	const params = new URLSearchParams();
	if (typeof options.media_role === 'string' && options.media_role.trim()) {
		params.set('media_role', options.media_role.trim());
	}

	const qs = params.toString();
	const data = await apiFetch<{ items?: unknown[] }>(`/admin/v1/media${qs ? `?${qs}` : ''}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map((item) => normalizeMediaItem(item)) : [];
}

export async function getAdminImages(
	options: BaseOptions & { media_role?: string } = {},
): Promise<AdminMediaImagesResponse> {
	const params = new URLSearchParams();
	if (typeof options.media_role === 'string' && options.media_role.trim()) {
		params.set('media_role', options.media_role.trim());
	}

	const qs = params.toString();
	const data = await apiFetch<{ items?: unknown[] }>(`/admin/v1/media${qs ? `?${qs}` : ''}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map(mediaToAdminImageItem) : [];
}

export async function getAdminMediaLabels(
	options: BaseOptions & { media_role?: string } = {},
): Promise<MediaLabels> {
	const params = new URLSearchParams();
	if (typeof options.media_role === 'string' && options.media_role.trim()) {
		params.set('media_role', options.media_role.trim());
	}

	const qs = params.toString();
	const data = await apiFetch<Partial<MediaLabels>>(`/admin/v1/media/labels${qs ? `?${qs}` : ''}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return {
		roles: Array.isArray(data.roles) ? data.roles : [],
		collections: Array.isArray(data.collections) ? data.collections : [],
		categories: Array.isArray(data.categories) ? data.categories : [],
	};
}

export async function getAdminMediaItem(file_key: string, options: BaseOptions = {}): Promise<MediaItem> {
	const data = await apiFetch<{ media?: unknown }>(`/admin/v1/media/${encodeURIComponent(file_key)}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
		parseAs: 'json',
	});

	return normalizeMediaItem(data.media);
}

export async function getAdminImage(file_key: string, options: BaseOptions = {}): Promise<AdminMediaImageItem> {
	const data = await apiFetch<{ media?: unknown }>(`/admin/v1/media/${encodeURIComponent(file_key)}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
		parseAs: 'json',
	});

	return mediaToAdminImageItem(data.media);
}

export async function uploadAdminMedia(
	file: File,
	input: {
		media_type?: string;
		media_role?: string;
		status?: string;
		title?: string;
		description?: string;
		collection?: string;
		category?: string;
		slug?: string;
		price?: string;
		detail_display_preset?: string;
		tags?: string;
		materials?: string;
		is_featured?: boolean;
		sort_order?: number;
	} = {},
	options: BaseOptions = {},
): Promise<MediaItem> {
	const form = new FormData();
	form.append('file', file);

	if (typeof input.media_type === 'string') form.append('media_type', input.media_type);
	if (typeof input.media_role === 'string') form.append('media_role', input.media_role);
	if (typeof input.status === 'string') form.append('status', input.status);
	if (typeof input.title === 'string') form.append('title', input.title);
	if (typeof input.description === 'string') form.append('description', input.description);
	if (typeof input.collection === 'string') form.append('collection', input.collection);
	if (typeof input.category === 'string') form.append('category', input.category);
	if (typeof input.slug === 'string') form.append('slug', input.slug);
	if (typeof input.price === 'string') form.append('price', input.price);
	if (typeof input.detail_display_preset === 'string') form.append('detail_display_preset', input.detail_display_preset);
	if (typeof input.tags === 'string') form.append('tags', input.tags);
	if (typeof input.materials === 'string') form.append('materials', input.materials);
	if (typeof input.is_featured === 'boolean') form.append('is_featured', String(input.is_featured));
	if (typeof input.sort_order === 'number') form.append('sort_order', String(input.sort_order));

	const data = await apiFetch<{ media?: unknown }>('/admin/v1/media/upload', {
		method: 'POST',
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
		body: form,
		parseAs: 'json',
	});

	return normalizeMediaItem(data.media);
}

export async function saveAdminMedia(
	file_key: string,
	input: {
		media_type?: string;
		media_role?: string;
		status?: string;
		is_featured?: boolean;
		title?: string;
		description?: string;
		price?: string;
		detail_display_preset?: string;
		collection?: string;
		category?: string;
		slug?: string;
		sort_order?: number;
		tags?: string;
		materials?: string;
		replace_file?: File;
	} = {},
	options: BaseOptions = {},
): Promise<MediaItem> {
	const form = new FormData();

	if (typeof input.media_type === 'string') form.append('media_type', input.media_type);
	if (typeof input.media_role === 'string') form.append('media_role', input.media_role);
	if (typeof input.status === 'string') form.append('status', input.status);
	if (typeof input.is_featured === 'boolean') form.append('is_featured', String(input.is_featured));
	if (typeof input.title === 'string') form.append('title', input.title);
	if (typeof input.description === 'string') form.append('description', input.description);
	if (typeof input.price === 'string') form.append('price', input.price);
	if (typeof input.detail_display_preset === 'string') form.append('detail_display_preset', input.detail_display_preset);
	if (typeof input.collection === 'string') form.append('collection', input.collection);
	if (typeof input.category === 'string') form.append('category', input.category);
	if (typeof input.slug === 'string') form.append('slug', input.slug);
	if (typeof input.sort_order === 'number') form.append('sort_order', String(input.sort_order));
	if (typeof input.tags === 'string') form.append('tags', input.tags);
	if (typeof input.materials === 'string') form.append('materials', input.materials);
	if (input.replace_file instanceof File) form.append('file', input.replace_file);

	const data = await apiFetch<{ media?: unknown }>(
		`/admin/v1/media/${encodeURIComponent(file_key)}/save`,
		{
			method: 'POST',
			apiBaseUrl: options.apiBaseUrl,
			headers: options.headers,
			body: form,
			parseAs: 'json',
		},
	);

	return normalizeMediaItem(data.media);
}

export async function deleteAdminMedia(file_key: string, options: BaseOptions = {}): Promise<void> {
	await apiFetch(`/admin/v1/media/${encodeURIComponent(file_key)}`, {
		method: 'DELETE',
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
}

export async function listAdminContentMedia(
	input: { limit?: number; offset?: number; q?: string; media_role?: string } = {},
	options: BaseOptions = {},
): Promise<AdminContentMediaListItem[]> {
	const limit = Number.isFinite(input.limit as number) ? Number(input.limit) : 24;
	const offset = Number.isFinite(input.offset as number) ? Number(input.offset) : 0;
	const params = new URLSearchParams();

	params.set('limit', String(limit));
	params.set('offset', String(offset));

	if (typeof input.q === 'string' && input.q.trim()) {
		params.set('q', input.q.trim());
	}
	if (typeof input.media_role === 'string' && input.media_role.trim()) {
		params.set('media_role', input.media_role.trim());
	}

	const data = await apiFetch<{ items?: unknown[] }>(`/admin/v1/media?${params.toString()}`, {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items.map(mediaToContentMediaItem) : [];
}

export async function uploadAdminContentMedia(
	file: File,
	input: { title?: string; media_role?: string; collection?: string; category?: string } = {},
	options: BaseOptions = {},
): Promise<AdminContentMediaUploadResponse> {
	const media = await uploadAdminMedia(file, {
		media_type: 'image',
		media_role: typeof input.media_role === 'string' && input.media_role.trim()
			? input.media_role.trim()
			: 'media_image',
		status: 'published',
		title: typeof input.title === 'string' && input.title.trim()
			? input.title.trim()
			: file.name.replace(/\.[^.]+$/, ''),
		collection: typeof input.collection === 'string' ? input.collection : undefined,
		category: typeof input.category === 'string' ? input.category : undefined,
	}, options);

	return mediaToContentMediaItem(media);
}
