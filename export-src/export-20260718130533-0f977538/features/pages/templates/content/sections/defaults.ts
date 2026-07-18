import { PAGE_SECTIONS_SCHEMA, type PageSection, type PageSectionAction, type PageSectionImage, type PageSectionThumbnail, type PageSectionsContent } from '../../../sections/core/types';
import { createPageSectionId } from '../../../sections/core/normalize';

export function defaultContentSectionAction(label = '', href = ''): PageSectionAction {
	return { label, target_type: 'external_url', page_id: null, href };
}

export function defaultContentSectionImage(): PageSectionImage {
	return { source: 'path', path: '', alt: '', shape: 'natural', link: defaultContentSectionAction('', '') };
}

export function defaultContentHeroContent(): Record<string, unknown> {
	return {
		eyebrow: '',
		headline: 'Page heading',
		body: '',
		image: defaultContentSectionImage(),
		primary_action: defaultContentSectionAction('', ''),
	};
}

export function defaultRichTextContent(): Record<string, unknown> {
	return {
		heading: '',
		body: '',
	};
}

export function defaultContentImageLinkTextContent(): Record<string, unknown> {
	return {
		heading: '',
		body: '',
		image: defaultContentSectionImage(),
	};
}

export function defaultContentThumbnail(): PageSectionThumbnail {
	return {
		image: { source: 'path', path: '', alt: '', shape: 'square' },
		link: defaultContentSectionAction('', ''),
	};
}

export function defaultThumbnailGridContent(): Record<string, unknown> {
	return {
		heading: '',
		body: '',
		thumbnail_shape: 'square',
		thumbnails: Array.from({ length: 4 }, () => defaultContentThumbnail()),
	};
}

export function createDefaultContentSection(type = 'rich_text', layout?: string): PageSection {
	if (type === 'content_hero') {
		return {
			id: createPageSectionId(),
			type: 'content_hero',
			layout: layout || 'content_hero.centered',
			content: defaultContentHeroContent(),
		};
	}

	if (type === 'image_link_text') {
		return {
			id: createPageSectionId(),
			type: 'image_link_text',
			layout: layout || 'image_link_text.image_left',
			content: defaultContentImageLinkTextContent(),
		};
	}

	if (type === 'thumbnail_grid') {
		return {
			id: createPageSectionId(),
			type: 'thumbnail_grid',
			layout: layout || 'thumbnail_grid.grid',
			content: defaultThumbnailGridContent(),
		};
	}

	return {
		id: createPageSectionId(),
		type: 'rich_text',
		layout: layout || 'rich_text.default',
		content: defaultRichTextContent(),
	};
}

export function createDefaultContentSectionsContent(): PageSectionsContent {
	return {
		schema: PAGE_SECTIONS_SCHEMA,
		sections: [createDefaultContentSection('content_hero'), createDefaultContentSection('rich_text')],
	};
}
