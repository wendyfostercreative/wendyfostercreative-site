import { resolveImageGalleryLayout } from '../layouts';
import type { ImageGalleryDisplay, ImageGalleryLink, ImageGallerySource, ImagePageHeader, ImageTemplateContent } from './types';

export const DEFAULT_IMAGE_GALLERY_SOURCE: ImageGallerySource = {
	mode: 'filtered',
	media_role: 'media_image',
	collection: '',
};

export const DEFAULT_IMAGE_GALLERY_DISPLAY: ImageGalleryDisplay = {
	layout_variant: 'grid',
	show_title: true,
	show_description: false,
	show_price: true,
	show_collection: false,
	show_materials: false,
};

export const DEFAULT_IMAGE_GALLERY_LINK: ImageGalleryLink = {
	label: '',
	url: '',
};

export const DEFAULT_IMAGE_TEMPLATE_CONTENT: ImageTemplateContent = {
	show_page_header: true,
	page_header: {
		eyebrow: '',
		heading: 'Gallery',
		intro: '',
	},
	source: { ...DEFAULT_IMAGE_GALLERY_SOURCE },
	display: { ...DEFAULT_IMAGE_GALLERY_DISPLAY },
	links: [],
};

function asObject(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value)
		? value as Record<string, unknown>
		: {};
}

function asString(value: unknown, fallback = ''): string {
	if (value == null) return fallback;
	return String(value).trim();
}

function asBool(value: unknown, fallback = false): boolean {
	if (typeof value === 'boolean') return value;
	if (typeof value === 'string') {
		const normalized = value.trim().toLowerCase();
		if (normalized === 'true') return true;
		if (normalized === 'false') return false;
	}
	return fallback;
}

function normalizePageHeader(value: unknown, fallback: ImagePageHeader = DEFAULT_IMAGE_TEMPLATE_CONTENT.page_header): ImagePageHeader {
	const raw = asObject(value);
	return {
		eyebrow: asString(raw.eyebrow, fallback.eyebrow),
		heading: asString(raw.heading, fallback.heading),
		intro: asString(raw.intro, fallback.intro),
	};
}

function normalizeSource(value: unknown): ImageGallerySource {
	const raw = asObject(value);
	const collection = asString(raw.collection);
	return {
		mode: asString(raw.mode, collection ? 'filtered' : DEFAULT_IMAGE_GALLERY_SOURCE.mode) === 'filtered' ? 'filtered' : 'all',
		media_role: asString(raw.media_role, DEFAULT_IMAGE_GALLERY_SOURCE.media_role) || DEFAULT_IMAGE_GALLERY_SOURCE.media_role,
		collection,
	};
}

function normalizeDisplay(value: unknown): ImageGalleryDisplay {
	const raw = asObject(value);
	return {
		layout_variant: resolveImageGalleryLayout(raw.layout_variant),
		show_title: asBool(raw.show_title, DEFAULT_IMAGE_GALLERY_DISPLAY.show_title),
		show_description: asBool(raw.show_description, DEFAULT_IMAGE_GALLERY_DISPLAY.show_description),
		show_price: asBool(raw.show_price, DEFAULT_IMAGE_GALLERY_DISPLAY.show_price),
		show_collection: asBool(raw.show_collection, DEFAULT_IMAGE_GALLERY_DISPLAY.show_collection),
		show_materials: asBool(raw.show_materials, DEFAULT_IMAGE_GALLERY_DISPLAY.show_materials),
	};
}

function normalizeLink(value: unknown): ImageGalleryLink | null {
	const raw = asObject(value);
	const label = asString(raw.label);
	const url = asString(raw.url);
	if (!label && !url) return null;
	return { label, url };
}

export function normalizeImageTemplateContent(value: unknown): ImageTemplateContent {
	const raw = asObject(value);
	const links = Array.isArray(raw.links)
		? raw.links.map((link) => normalizeLink(link)).filter((link): link is ImageGalleryLink => Boolean(link))
		: [];

	return {
		show_page_header: asBool(raw.show_page_header, DEFAULT_IMAGE_TEMPLATE_CONTENT.show_page_header),
		page_header: normalizePageHeader(raw.page_header),
		source: normalizeSource(raw.source),
		display: normalizeDisplay(raw.display),
		links,
	};
}
