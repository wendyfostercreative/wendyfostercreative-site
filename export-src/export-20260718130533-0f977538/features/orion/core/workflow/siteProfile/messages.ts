import type { OrionMessage } from '../../types';
import type { OrionSiteProfileLabels } from '../../../admin/assistant/siteProfile/context/labels';
import type { OrionSiteProfileWorkflowLabels } from './labels';
import type { OrionSiteProfileProposal, OrionSummary } from './types';
import { createSiteProfileProposalReviewCard, createSiteProfileReviewCard } from './review';

export function createSiteProfileSummaryMessage(
	summary: OrionSummary,
	labels: OrionSiteProfileLabels & OrionSiteProfileWorkflowLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: '',
		review: createSiteProfileReviewCard(summary, labels),
	};
}

export function createSiteProfileConfirmedMessage(
	labels: OrionSiteProfileLabels & OrionSiteProfileWorkflowLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: labels.confirmedReview,
	};
}

export function createSiteProfileEditMessage(labels: OrionSiteProfileLabels): OrionMessage {
	return {
		role: 'assistant',
		text: labels.editReply,
	};
}

export function createSiteProfileProposalMessage(
	proposal: OrionSiteProfileProposal,
	labels: OrionSiteProfileLabels & OrionSiteProfileWorkflowLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: '',
		review: createSiteProfileProposalReviewCard(proposal, labels),
	};
}

export function createSiteProfileApplySuccessMessage(labels: OrionSiteProfileLabels): OrionMessage {
	return {
		role: 'assistant',
		text: labels.applySuccess,
		actions: [
			{
				id: 'route_to_step',
				label: labels.siteProfileContinueToSiteConfig,
				href: '/admin/site',
			},
		],
	};
}

export function createSiteProfileProposalErrorMessage(labels: OrionSiteProfileLabels): OrionMessage {
	return {
		role: 'assistant',
		text: labels.proposalError,
	};
}

export function createSiteProfileApplyErrorMessage(labels: OrionSiteProfileLabels): OrionMessage {
	return {
		role: 'assistant',
		text: labels.applyError,
	};
}
