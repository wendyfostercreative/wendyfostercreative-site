import { PAGE_SECTIONS_SCHEMA, type PageSection, type PageSectionAction, type PageSectionImage, type PageSectionsContent } from '../../../sections/core/types';
import { createPageSectionId } from '../../../sections/core/normalize';

export function defaultSectionImage(): PageSectionImage {
	return { source: 'path', path: '', alt: '', shape: 'natural', link: defaultSectionAction('', '') };
}

export function defaultSectionAction(label = '', href = ''): PageSectionAction {
	return { label, target_type: 'external_url', page_id: null, href };
}

export function defaultHeroContent(): Record<string, unknown> {
	return {
		eyebrow: '',
		headline: 'Welcome',
		body: '',
		image: defaultSectionImage(),
		primary_action: defaultSectionAction('View gallery', '/gallery'),
		secondary_action: defaultSectionAction('', ''),
	};
}

export function defaultImageLinkTextContent(): Record<string, unknown> {
	return {
		heading: '',
		body: '',
		image: defaultSectionImage(),
	};
}

export function createDefaultHomeSection(type = 'hero', layout?: string): PageSection {
	const isImageLinkText = type === 'image_link_text';
	return {
		id: createPageSectionId(),
		type: isImageLinkText ? 'image_link_text' : 'hero',
		layout: layout || (isImageLinkText ? 'image_link_text.image_left' : 'hero.centered'),
		content: isImageLinkText ? defaultImageLinkTextContent() : defaultHeroContent(),
	};
}

export function createDefaultHomeSectionsContent(): PageSectionsContent {
	return {
		schema: PAGE_SECTIONS_SCHEMA,
		sections: [createDefaultHomeSection('hero')],
	};
}
