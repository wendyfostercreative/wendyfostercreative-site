import type { OrionMessage } from '../../types';
import type { OrionSiteConfigLabels } from '../../../admin/assistant/siteConfig/context/labels';
import type { OrionSiteConfigWorkflowLabels } from './labels';
import type { OrionSiteProposal, OrionSiteSummary } from './types';
import {
	createSiteConfigProposalReviewCard,
	createSiteConfigReviewCard,
} from './review';

export function createSiteConfigSummaryMessage(
	summary: OrionSiteSummary,
	labels: OrionSiteConfigLabels & OrionSiteConfigWorkflowLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: '',
		review: createSiteConfigReviewCard(summary, labels),
		actions: [{ id: 'edit_summary', label: labels.editSummary }],
	};
}

export function createSiteConfigConfirmedMessage(_labels: OrionSiteConfigLabels): OrionMessage {
	return {
		role: 'assistant',
		text: _labels.siteConfigConfirmedLoaded,
	};
}

export function createSiteConfigProposalMessage(
	proposal: OrionSiteProposal,
	labels: OrionSiteConfigLabels & OrionSiteConfigWorkflowLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: '',
		review: createSiteConfigProposalReviewCard(proposal, labels),
		actions: [{ id: 'apply_proposal', label: labels.siteApplyProposal }],
	};
}

export function createSiteConfigApplySuccessMessage(labels: OrionSiteConfigLabels): OrionMessage {
	return {
		role: 'assistant',
		text: labels.siteApplySuccess,
		actions: [
			{
				id: 'route_to_step',
				label: labels.siteConfigContinueToHeaderNav,
				href: '/admin/headerNav',
			},
		],
	};
}
