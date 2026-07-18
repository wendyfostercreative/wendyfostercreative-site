import type { PageSection, PageSectionRegistry } from '../../../sections/core/types';
import { defaultContentHeroContent, defaultContentImageLinkTextContent, defaultRichTextContent, defaultThumbnailGridContent } from './defaults';

function text(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

export const contentSectionRegistry: PageSectionRegistry = {
	content_hero: {
		type: 'content_hero',
		label: 'Content Hero',
		description: 'A page introduction with optional supporting image and action.',
		defaultLayout: 'content_hero.centered',
		layouts: [
			{ key: 'content_hero.centered', label: 'Centered', description: 'Centered introductory copy.' },
			{ key: 'content_hero.image_right', label: 'Image right', description: 'Intro copy beside a supporting image.' },
		],
		defaultContent: defaultContentHeroContent,
		summarize(section: PageSection): string {
			return text(section.content.headline) || text(section.content.body) || 'Content hero section';
		},
	},
	rich_text: {
		type: 'rich_text',
		label: 'Rich Text',
		description: 'A focused heading and body text block.',
		defaultLayout: 'rich_text.default',
		layouts: [
			{ key: 'rich_text.default', label: 'Default', description: 'Readable text width.' },
		],
		defaultContent: defaultRichTextContent,
		summarize(section: PageSection): string {
			return text(section.content.heading) || text(section.content.body) || 'Rich text section';
		},
	},
	image_link_text: {
		type: 'image_link_text',
		label: 'Image + Link + Text',
		description: 'A supporting image that can link to another CMS page, paired with text.',
		defaultLayout: 'image_link_text.image_left',
		layouts: [
			{ key: 'image_link_text.image_left', label: 'Image left', description: 'Image beside text.' },
			{ key: 'image_link_text.image_right', label: 'Image right', description: 'Text beside image.' },
		],
		defaultContent: defaultContentImageLinkTextContent,
		summarize(section: PageSection): string {
			return text(section.content.heading) || text(section.content.body) || 'Image, link, and text section';
		},
	},
	thumbnail_grid: {
		type: 'thumbnail_grid',
		label: 'Thumbnail Grid',
		description: 'A block of up to ten linked thumbnails.',
		defaultLayout: 'thumbnail_grid.grid',
		layouts: [
			{ key: 'thumbnail_grid.grid', label: 'Grid', description: 'Responsive thumbnail grid.' },
		],
		defaultContent: defaultThumbnailGridContent,
		summarize(section: PageSection): string {
			const thumbnails = Array.isArray(section.content.thumbnails) ? section.content.thumbnails : [];
			const count = thumbnails.filter((item) => {
				const raw = item && typeof item === 'object' ? item as Record<string, unknown> : {};
				const image = raw.image && typeof raw.image === 'object' ? raw.image as Record<string, unknown> : {};
				return Boolean(image.path);
			}).length;
			return text(section.content.heading) || `${count || 'No'} thumbnail${count === 1 ? '' : 's'}`;
		},
	},
};
