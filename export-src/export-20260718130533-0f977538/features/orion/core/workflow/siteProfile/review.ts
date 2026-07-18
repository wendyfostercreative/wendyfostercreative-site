import type { OrionReviewCard } from '../../types';
import type { OrionSiteProfileWorkflowLabels } from './labels';
import type { OrionSiteProfileProposal, OrionSummary } from './types';

function currentCardKey(summary: OrionSummary): string | null {
	return typeof summary.model_input?.card_key === 'string' ? summary.model_input.card_key : null;
}

export function createSiteProfileReviewCard(
	summary: OrionSummary,
	labels: OrionSiteProfileWorkflowLabels,
): OrionReviewCard {
	const cardKey = currentCardKey(summary);

	if (cardKey === 'starter_pages') {
		return {
			title: labels.previewStarterPagesTitle,
			description: labels.previewStarterPagesDescription,
			sections: [],
		};
	}

	return {
		title: labels.previewSiteTypeTitle,
		description: labels.previewSiteTypeDescription,
		sections: [],
	};
}

export function createSiteProfileProposalReviewCard(
	_proposal: OrionSiteProfileProposal,
	labels: OrionSiteProfileWorkflowLabels,
): OrionReviewCard {
	return {
		eyebrow: labels.proposalIntro,
		title: labels.previewProposalTitle,
		description: labels.previewProposalDescription,
		sections: [],
	};
}
