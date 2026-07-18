import { postSiteConfigProposal } from '../../api';
import type {
	OrionSiteProposal,
	OrionSiteSummary,
} from '../../../core/workflow/siteConfig';
import { handleSiteConfigAction } from './actions';
import { handleSiteConfigSubmit } from './submit';
import {
	createSiteConfigApplySuccessMessage,
	createSiteConfigConfirmedMessage,
	createSiteConfigEditMessage,
	createSiteConfigProposalMessage,
	createSiteConfigSummaryMessage,
	currentCardDraftForSummary,
	isSiteSummary,
	mergeSiteSummary,
	type SiteConfigStepController,
	type SiteConfigSummarizeContext,
} from './workflow';

export const siteConfigAssistant: SiteConfigStepController = {
	domain: 'site_config' as const,

	async summarize(
		message: string,
		context: SiteConfigSummarizeContext = {},
	): Promise<OrionSiteSummary> {
		const result = await postSiteConfigProposal(message, context.currentSummary, {
			cardKey: context.cardKey,
			currentCardDraft: context.currentCardDraft,
		});
		return result.summary;
	},

	merge(existing, next) {
		return mergeSiteSummary(isSiteSummary(existing) ? existing : null, next);
	},

	createSummaryMessage(summary, labels) {
		return createSiteConfigSummaryMessage(summary, labels);
	},

	createConfirmedMessage(labels) {
		return createSiteConfigConfirmedMessage(labels);
	},

	createEditMessage(activeCardKey, labels) {
		return createSiteConfigEditMessage(activeCardKey, labels);
	},

	async propose(summary): Promise<OrionSiteProposal> {
		const activeCardKey =
			typeof summary.model_input?.card_key === 'string'
				? summary.model_input.card_key
				: null;
		const result = await postSiteConfigProposal(summary.admin_message || '', summary, {
			cardKey: activeCardKey,
			currentCardDraft: currentCardDraftForSummary(summary, activeCardKey),
		});
		return result.proposal;
	},

	createProposalMessage(proposal, labels) {
		return createSiteConfigProposalMessage(proposal, labels);
	},

	async apply(proposal): Promise<void> {
		void proposal;
	},

	createApplySuccessMessage(labels) {
		return createSiteConfigApplySuccessMessage(labels);
	},

	createProposalErrorMessage(labels) {
		return {
			role: 'assistant',
			text: labels.siteProposalError,
		};
	},

	createApplyErrorMessage(labels) {
		return {
			role: 'assistant',
			text: labels.siteApplyError,
		};
	},

	async handleAction(context) {
		return await handleSiteConfigAction(siteConfigAssistant, context);
	},

	async handleSubmit(context) {
		return await handleSiteConfigSubmit(siteConfigAssistant, context);
	},
};
