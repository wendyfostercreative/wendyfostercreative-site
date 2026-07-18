import type { OrionReviewCard } from '../../types';
import type { OrionSiteConfigWorkflowLabels } from './labels';
import type { OrionSiteProposal, OrionSiteSummary } from './types';

function currentCardKey(summary: OrionSiteSummary): string | null {
	return typeof summary.model_input?.card_key === 'string' ? summary.model_input.card_key : null;
}

export function createSiteConfigReviewCard(
	summary: OrionSiteSummary,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	const cardKey = currentCardKey(summary);

	if (cardKey === 'typography') {
		return {
			title: labels.sitePreviewTypographyTitle,
			description: labels.sitePreviewTypographyDescription,
			sections: [],
		};
	}

	if (cardKey === 'theme') {
		return {
			title: labels.sitePreviewThemeTitle,
			description: labels.sitePreviewThemeDescription,
			sections: [],
		};
	}

	if (cardKey === 'components') {
		return {
			title: labels.sitePreviewComponentsTitle,
			description: labels.sitePreviewComponentsDescription,
			sections: [],
		};
	}

	if (cardKey === 'seo') {
		return {
			title: labels.sitePreviewSeoTitle,
			description: labels.sitePreviewSeoDescription,
			sections: [],
		};
	}

	return {
		title: labels.sitePreviewBrandingTitle,
		description: labels.sitePreviewBrandingDescription,
		sections: [],
	};
}

export function createSiteConfigProposalReviewCard(
	_proposal: OrionSiteProposal,
	labels: OrionSiteConfigWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: labels.siteProposalIntro,
		title: labels.sitePreviewProposalTitle,
		description: labels.sitePreviewProposalDescription,
		sections: [],
	};
}
