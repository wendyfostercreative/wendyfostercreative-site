import type { PageSection, PageSectionRegistry } from '../../../sections/core/types';
import { defaultContactDetailsContent, defaultContactFormBlockContent, defaultContactIntroContent } from './defaults';

function text(value: unknown): string {
	return typeof value === 'string' ? value.trim() : '';
}

const contactLayouts = (type: string) => [
	{ key: `${type}.left`, label: 'Left', description: 'Left-aligned contact section.' },
	{ key: `${type}.center`, label: 'Center', description: 'Centered contact section.' },
	{ key: `${type}.right`, label: 'Right', description: 'Right-aligned contact section.' },
];

export const contactSectionRegistry: PageSectionRegistry = {
	contact_intro: {
		type: 'contact_intro',
		label: 'Contact Intro',
		description: 'A short introduction for the contact page.',
		defaultLayout: 'contact_intro.center',
		layouts: contactLayouts('contact_intro'),
		defaultContent: defaultContactIntroContent,
		summarize(section: PageSection): string {
			return text(section.content.heading) || text(section.content.body) || 'Contact intro section';
		},
	},
	contact_details: {
		type: 'contact_details',
		label: 'Contact Details',
		description: 'Email, phone, and location details.',
		defaultLayout: 'contact_details.center',
		layouts: contactLayouts('contact_details'),
		defaultContent: defaultContactDetailsContent,
		summarize(section: PageSection): string {
			return text(section.content.email) || text(section.content.phone) || text(section.content.location) || 'Contact details section';
		},
	},
	contact_form_block: {
		type: 'contact_form_block',
		label: 'Contact Form',
		description: 'A simple contact form block with heading and submit label.',
		defaultLayout: 'contact_form_block.center',
		layouts: contactLayouts('contact_form_block'),
		defaultContent: defaultContactFormBlockContent,
		summarize(section: PageSection): string {
			return text(section.content.heading) || text(section.content.body) || 'Contact form block';
		},
	},
};
