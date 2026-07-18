import type { PageSection, PageSectionRegistry } from '../../../sections/core/types';
import { defaultHeroContent, defaultImageLinkTextContent } from './defaults';

function text(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

export const homeSectionRegistry: PageSectionRegistry = {
	hero: {
		type: 'hero',
		label: 'Hero',
		description: 'A prominent home-page introduction with optional image and actions.',
		defaultLayout: 'hero.centered',
		layouts: [
			{ key: 'hero.centered', label: 'Centered', description: 'Centered text with optional image.' },
			{ key: 'hero.image_right', label: 'Image right', description: 'Text on the left, image on the right.' },
		],
		defaultContent: defaultHeroContent,
		summarize(section: PageSection): string {
			return text(section.content.headline) || text(section.content.body) || 'Hero section';
		},
	},
	image_link_text: {
		type: 'image_link_text',
		label: 'Image + Link + Text',
		description: 'A supporting image, text, and one page-aware action link.',
		defaultLayout: 'image_link_text.image_left',
		layouts: [
			{ key: 'image_link_text.image_left', label: 'Image left', description: 'Image beside text.' },
			{ key: 'image_link_text.image_right', label: 'Image right', description: 'Text beside image.' },
		],
		defaultContent: defaultImageLinkTextContent,
		summarize(section: PageSection): string {
			return text(section.content.heading) || text(section.content.body) || 'Image, link, and text section';
		},
	},
};
