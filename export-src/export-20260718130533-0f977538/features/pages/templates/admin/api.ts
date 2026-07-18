import { apiFetch } from '../../../../lib/api';
import type { BaseOptions } from '../../../../lib/types';

import type { CmsPageTemplateMetadata } from '../../core/types';

export async function getAdminPageTemplates(
	options: BaseOptions = {},
): Promise<CmsPageTemplateMetadata[]> {
	const data = await apiFetch<{ items?: CmsPageTemplateMetadata[] }>('/admin/v1/page-templates', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return Array.isArray(data.items) ? data.items : [];
}

export async function getAdminPageTemplate(
	template: string,
	options: BaseOptions = {},
): Promise<CmsPageTemplateMetadata> {
	const data = await apiFetch<{ template?: CmsPageTemplateMetadata }>(
		`/admin/v1/page-templates/${encodeURIComponent(template)}`,
		{
			apiBaseUrl: options.apiBaseUrl,
			headers: options.headers,
		},
	);

	if (!data.template) throw new Error('Template metadata was not returned.');
	return data.template;
}
