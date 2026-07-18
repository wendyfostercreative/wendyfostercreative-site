export type CmsPage = {
	id: number;
	title: string;
	path: string;
	template: string;
	published: boolean;
	show_in_nav: boolean;
	nav_label?: string | null;
	nav_order?: number | null;
	seo_title?: string | null;
	seo_description?: string | null;
	content?: Record<string, unknown> | unknown[] | null;
	created_at: string;
	updated_at: string;
};

export type CmsTemplateFieldOption = {
	value: string;
	label: string;
	ui?: string;
};

export type CmsTemplateField = {
	name: string;
	label: string;
	input: 'text' | 'textarea' | 'email' | 'select';
	description?: string;
	default?: string;
	placeholder?: string;
	rows?: number;
	options?: CmsTemplateFieldOption[];
	ui?: string;
};

export type CmsPageTemplateMetadata = {
	value: string;
	label: string;
	description: string;
	structured_fields: CmsTemplateField[];
};
