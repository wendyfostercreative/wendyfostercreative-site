export const PAGE_SECTIONS_SCHEMA = 'page.sections.v1';

// Section types are template-scoped: `image_link_text` in Home and Content are distinct `(template, type)` pairs.
export type PageSectionImageShape = 'natural' | 'square' | 'wide';

export type PageSectionImage = {
	source: 'path';
	path: string;
	thumb_path?: string;
	alt?: string;
	shape?: PageSectionImageShape;
	link?: PageSectionAction;
};

export type PageSectionThumbnail = {
	image: PageSectionImage;
	link?: PageSectionAction;
};

export type PageSectionAction = {
	label: string;
	target_type: 'cms_page' | 'external_url';
	page_id?: number | null;
	href: string;
};

export type PageSection = {
	id: string;
	type: string;
	layout: string;
	content: Record<string, unknown>;
	settings?: Record<string, unknown>;
};

export type PageSectionsContent = {
	schema: typeof PAGE_SECTIONS_SCHEMA;
	sections: PageSection[];
};

export type PageSectionLayoutDefinition = {
	key: string;
	label: string;
	description?: string;
};

export type PageSectionDefinition = {
	type: string;
	label: string;
	description: string;
	layouts: PageSectionLayoutDefinition[];
	defaultLayout: string;
	defaultContent: () => Record<string, unknown>;
	summarize: (section: PageSection) => string;
};

export type PageSectionRegistry = Record<string, PageSectionDefinition>;
