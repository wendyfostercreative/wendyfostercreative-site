import { PAGE_SECTIONS_SCHEMA, type PageSection, type PageSectionsContent } from '../../../sections/core/types';
import { createPageSectionId } from '../../../sections/core/normalize';

export function defaultContactIntroContent(): Record<string, unknown> {
	return {
		eyebrow: '',
		heading: 'Contact',
		body: '',
	};
}

export function defaultContactDetailsContent(): Record<string, unknown> {
	return {
		email: '',
		phone: '',
		location: '',
	};
}

export function defaultContactFormBlockContent(): Record<string, unknown> {
	return {
		heading: 'Send a message',
		body: '',
		submit_label: 'Send message',
	};
}

export function createDefaultContactSection(type = 'contact_details', layout?: string): PageSection {
	if (type === 'contact_intro') {
		return {
			id: createPageSectionId(),
			type: 'contact_intro',
			layout: layout || 'contact_intro.center',
			content: defaultContactIntroContent(),
		};
	}

	if (type === 'contact_form_block') {
		return {
			id: createPageSectionId(),
			type: 'contact_form_block',
			layout: layout || 'contact_form_block.center',
			content: defaultContactFormBlockContent(),
		};
	}

	return {
		id: createPageSectionId(),
		type: 'contact_details',
		layout: layout || 'contact_details.center',
		content: defaultContactDetailsContent(),
	};
}

export function createDefaultContactSectionsContent(): PageSectionsContent {
	return {
		schema: PAGE_SECTIONS_SCHEMA,
		sections: [
			createDefaultContactSection('contact_intro'),
			createDefaultContactSection('contact_details'),
			createDefaultContactSection('contact_form_block'),
		],
	};
}
