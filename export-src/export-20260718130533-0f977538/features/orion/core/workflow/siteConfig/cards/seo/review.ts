import type { OrionReviewCard } from '../../../../types';
import type { OrionSiteConfigWorkflowLabels } from '../../labels';
import type { OrionSiteConfigSeoDraft } from './types';

function valueOrBlank(value: string | null | undefined, empty: string): string {
	return value?.trim() || empty;
}

export function createSeoCardReview(
	draft: OrionSiteConfigSeoDraft,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: 'SEO',
		title: valueOrBlank(draft.seo_title, 'Search defaults'),
		description: 'This controls the default search title and search description for the whole site.',
		sections: [
			{
				title: 'Search defaults',
				rows: [
					{
						label: 'SEO title',
						value: valueOrBlank(draft.seo_title, labels.summaryEmpty),
					},
					{
						label: 'Search description',
						value: valueOrBlank(draft.seo_description, labels.summaryEmpty),
					},
				],
			},
		],
	};
}
