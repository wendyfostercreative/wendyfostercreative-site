import { fetchSiteProfileProposal } from '../../api';
import type {
	OrionSiteProfileProposal,
	OrionSummary,
} from '../../../core/workflow/siteProfile';
import { handleSiteProfileAction } from './actions';
import { handleSiteProfileSubmit } from './submit';
import {
	createSiteProfileApplyErrorMessage,
	createSiteProfileApplySuccessMessage,
	createSiteProfileConfirmedMessage,
	createSiteProfileEditMessage,
	createSiteProfileProposalErrorMessage,
	createSiteProfileProposalMessage,
	createSiteProfileSummaryMessage,
	currentCardDraftForSummary,
	isSiteProfileSummary,
	mergeSiteProfileSummary,
	type SiteProfileStepController,
	type SiteProfileSummarizeContext,
} from './workflow';

export const siteProfileAssistant: SiteProfileStepController = {
	domain: 'site_profile' as const,

	async summarize(message: string, context: SiteProfileSummarizeContext = {}): Promise<OrionSummary> {
		const result = await fetchSiteProfileProposal(message, context.currentSummary, {
			cardKey: context.cardKey,
			currentCardDraft: context.currentCardDraft,
		});
		return result.summary;
	},

	merge(existing, next) {
		return mergeSiteProfileSummary(isSiteProfileSummary(existing) ? existing : null, next);
	},

	createSummaryMessage(summary, labels) {
		return createSiteProfileSummaryMessage(summary, labels);
	},

	createConfirmedMessage(labels) {
		return createSiteProfileConfirmedMessage(labels);
	},

	createEditMessage(labels) {
		return createSiteProfileEditMessage(labels);
	},

	async propose(summary: OrionSummary): Promise<OrionSiteProfileProposal> {
		const activeCardKey = typeof summary.model_input?.card_key === 'string' ? summary.model_input.card_key : null;
		const result = await fetchSiteProfileProposal(summary.admin_message || '', summary, {
			cardKey: activeCardKey,
			currentCardDraft: currentCardDraftForSummary(summary, activeCardKey),
		});
		return result.proposal;
	},

	createProposalMessage(proposal, labels) {
		return createSiteProfileProposalMessage(proposal, labels);
	},

	async apply(proposal: OrionSiteProfileProposal): Promise<void> {
		void proposal;
	},

	createApplySuccessMessage(labels) {
		return createSiteProfileApplySuccessMessage(labels);
	},

	createProposalErrorMessage(labels) {
		return createSiteProfileProposalErrorMessage(labels);
	},

	createApplyErrorMessage(labels) {
		return createSiteProfileApplyErrorMessage(labels);
	},

	async handleAction(context) {
		return await handleSiteProfileAction(siteProfileAssistant, context);
	},

	async handleSubmit(context) {
		return await handleSiteProfileSubmit(siteProfileAssistant, context);
	},
};
