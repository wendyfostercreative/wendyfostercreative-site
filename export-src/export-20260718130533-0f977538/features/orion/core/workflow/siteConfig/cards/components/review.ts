import type { OrionReviewCard } from '../../../../types';
import type { OrionSiteConfigWorkflowLabels } from '../../labels';
import type { OrionSiteConfigComponentsDraft } from './types';

function valueOrBlank(value: string | null | undefined, empty: string): string {
	return value?.trim() || empty;
}

export function createComponentsCardReview(
	draft: OrionSiteConfigComponentsDraft,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: 'Components',
		title: 'Layout and corners',
		description: 'This controls shared page width and the corner radius used by cards, buttons, and inputs.',
		sections: [
			{
				title: 'Layout width',
				rows: [
					{
						label: 'Container width',
						value: valueOrBlank(draft.container_width, labels.summaryEmpty),
					},
					{
						label: 'Content width',
						value: valueOrBlank(draft.content_width, labels.summaryEmpty),
					},
				],
			},
			{
				title: 'Corner radius',
				rows: [
					{
						label: 'Card corners',
						value: valueOrBlank(draft.card_radius, labels.summaryEmpty),
					},
					{
						label: 'Button corners',
						value: valueOrBlank(draft.button_radius, labels.summaryEmpty),
					},
					{
						label: 'Input corners',
						value: valueOrBlank(draft.input_radius, labels.summaryEmpty),
					},
				],
			},
		],
	};
}
