import type { OrionReviewCard } from '../../../../types';
import type { OrionSiteConfigWorkflowLabels } from '../../labels';
import type { OrionSiteConfigThemeDraft } from './types';

function valueOrBlank(value: string | null | undefined, empty: string): string {
	return value?.trim() || empty;
}

function themeModeLabel(value: string | null | undefined, empty: string): string {
	if (value === 'light') return 'Light';
	if (value === 'dark') return 'Dark';
	return empty;
}

export function createThemeCardReview(
	draft: OrionSiteConfigThemeDraft,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: 'Theme',
		title: valueOrBlank(draft.primary_color, labels.summaryEmpty),
		description: 'This creates a balanced color theme from your main color, optional accent color, and light or dark preference.',
		sections: [
			{
				title: 'Color theme',
				rows: [
					{
						label: 'Main color',
						value: valueOrBlank(draft.primary_color, labels.summaryEmpty),
					},
					{
						label: 'Accent color',
						value: valueOrBlank(draft.accent_color, labels.summaryEmpty),
					},
					{
						label: 'Theme mode',
						value: themeModeLabel(draft.theme_mode, labels.summaryEmpty),
					},
				],
			},
		],
	};
}
