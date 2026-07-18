import type { OrionReviewCard } from '../../../../types';
import type { OrionSiteConfigWorkflowLabels } from '../../labels';
import type { OrionSiteConfigBrandingDraft } from './types';

function valueOrBlank(value: string | null | undefined, empty: string): string {
	return value?.trim() || empty;
}

export function createBrandingCardReview(
	draft: OrionSiteConfigBrandingDraft,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: 'Branding',
		title: valueOrBlank(draft.site_name, labels.summaryEmpty),
		description: 'This controls the text brand name plus optional logo details shown across the site.',
		sections: [
			{
				title: 'Brand identity',
				rows: [
					{
						label: 'Site name',
						value: valueOrBlank(draft.site_name, labels.summaryEmpty),
					},
					{
						label: 'Logo path',
						value: valueOrBlank(draft.logo_path, labels.summaryEmpty),
					},
					{
						label: 'Logo alt text',
						value: valueOrBlank(draft.logo_alt_text, labels.summaryEmpty),
					},
				],
			},
		],
	};
}
