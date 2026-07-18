export type CmsTemplatePreview =
	| 'home'
	| 'content'
	| 'media'
	| 'custom';

export type CmsTemplatePreviewDefinition = {
	value: string;
	preview: CmsTemplatePreview;
};

export type CmsTemplateCardDefinition = {
	value: string;
	label: string;
	description?: string;
	preview: CmsTemplatePreview;
};

export const CMS_TEMPLATE_PREVIEWS: CmsTemplatePreviewDefinition[] = [
	{ value: 'home', preview: 'home' },
	{ value: 'content', preview: 'content' },
	{ value: 'media', preview: 'media' },
];

export function getCmsTemplatePreview(
	value: string | null | undefined,
): CmsTemplatePreview {
	const normalized = String(value || '').trim().toLowerCase();
	return (
		CMS_TEMPLATE_PREVIEWS.find((template) => template.value === normalized)?.preview ||
		'custom'
	);
}
