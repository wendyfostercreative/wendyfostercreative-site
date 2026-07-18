import type { OrionReviewCard } from '../../../../types';
import type { OrionSiteConfigWorkflowLabels } from '../../labels';
import type { OrionSiteConfigTypographyDraft } from './types';

function valueOrBlank(value: string | null | undefined, empty: string): string {
	return value?.trim() || empty;
}

export function createTypographyCardReview(
	draft: OrionSiteConfigTypographyDraft,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: 'Typography',
		title: valueOrBlank(draft.primary_font, labels.summaryEmpty),
		description: 'This controls the primary site font plus optional brand and nav fonts that inherit the primary font when left blank.',
		sections: [
			{
				title: 'Typography defaults',
				rows: [
					{
						label: 'Primary font',
						value: valueOrBlank(draft.primary_font, labels.summaryEmpty),
					},
					{
						label: 'Brand font',
						value: valueOrBlank(draft.brand_font, labels.summaryEmpty),
					},
					{
						label: 'Nav font',
						value: valueOrBlank(draft.nav_font, labels.summaryEmpty),
					},
				],
			},
		],
	};
}
