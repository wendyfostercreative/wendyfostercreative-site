import { getCmsPathReasonForTemplate, normalizeCmsPagePath } from '../core/pagePaths';
import type { CmsPage, CmsPageTemplateMetadata } from '../core/types';

export function getAdminPageEditView(input: {
	page: CmsPage;
	templateMeta: CmsPageTemplateMetadata;
}): {
	templateLabel: string;
	selectedContent: Record<string, unknown>;
	normalizedPath: string;
	reservedPathReason: string | null;
} {
	const { page, templateMeta } = input;
	const templateLabel = templateMeta.label || page.template;

	const selectedContent =
		page.content && typeof page.content === 'object' && !Array.isArray(page.content)
			? (page.content as Record<string, unknown>)
			: {};

	const normalizedPath = normalizeCmsPagePath(page.path);
	const reservedPathReason = getCmsPathReasonForTemplate(normalizedPath, page.template);

	return {
		templateLabel,
		selectedContent,
		normalizedPath,
		reservedPathReason,
	};
}
