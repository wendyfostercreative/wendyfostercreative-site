import {
	createSiteProfileApplyErrorMessage,
	createSiteProfileApplySuccessMessage,
	createSiteProfileConfirmedMessage,
	createSiteProfileEditMessage,
	createSiteProfileProposalErrorMessage,
	createSiteProfileProposalMessage,
	createSiteProfileSummaryMessage,
	getSiteProfileCard,
	getSiteProfileCardByKey,
	getSiteProfileCardForSummary,
	mergeSiteProfileSummary,
} from '../../../../core/workflow/siteProfile';
import type {
	OrionAssistantLabels,
	OrionMessage,
	OrionMessageAction,
	OrionWorkflowState,
	OrionWorkflowSummary,
} from '../../../../core/types';
import type {
	OrionSiteProfileProposal,
	OrionSummary,
} from '../../../../core/workflow/siteProfile';
import type { OrionStepController } from '../../shared/types/step';
import type { OrionSiteProfileLabels } from '../context/labels';
import { isSiteProfileProposal, isSiteProfileSummary } from '../../state/guards';
import { SITE_PROFILE_SITE_TYPE_CARD_KEY } from '../../../../core/workflow/siteProfile/cards/types';
import type { SiteProfileCard } from '../../../../core/workflow/siteProfile/cards/types';

export type SiteProfileActionContext = {
	action: OrionMessageAction['id'];
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	setWorkflow: (workflow: OrionWorkflowState) => void;
	appendMessage: (message: OrionMessage) => void;
	onApplied?: () => void;
};

export type SiteProfileSummarizeContext = {
	currentSummary?: OrionSummary | null;
	cardKey?: string | null;
	currentCardDraft?: Record<string, unknown> | null;
};

export type SiteProfileSubmitContext = {
	text: string;
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	pathname: string;
	setWorkflow: (workflow: OrionWorkflowState) => void;
	appendMessage: (message: OrionMessage) => void;
};

export type SiteProfileStepController = OrionStepController<
	OrionSummary,
	OrionSiteProfileProposal,
	SiteProfileSummarizeContext
> & {
	createEditMessage: (labels: OrionSiteProfileLabels) => OrionMessage;
	handleAction: (context: SiteProfileActionContext) => Promise<boolean>;
	handleSubmit: (context: SiteProfileSubmitContext) => Promise<boolean>;
};

export type SiteProfileStepUi = Pick<
	SiteProfileStepController,
	| 'createSummaryMessage'
	| 'createConfirmedMessage'
	| 'createEditMessage'
	| 'createProposalMessage'
	| 'createApplySuccessMessage'
	| 'createProposalErrorMessage'
	| 'createApplyErrorMessage'
	| 'merge'
	| 'apply'
>;

export function proposalReadyWorkflow(workflow: OrionWorkflowState): OrionWorkflowState {
	return {
		...workflow,
		step: 'proposal_ready',
		returnToFinalReview: false,
	};
}

export function committedDraftWorkflow(workflow: OrionWorkflowState): OrionWorkflowState {
	return {
		...workflow,
		draftSummary: workflow.summary,
		draftProposal: workflow.proposal,
	};
}

export function collectingWorkflow(
	workflow: OrionWorkflowState,
	activeCardKey: string,
	returnToFinalReview: boolean,
): OrionWorkflowState {
	return {
		...workflow,
		step: 'collecting',
		activeCardKey,
		returnToFinalReview,
	};
}

export function editSiteProfileCardKeyFromAction(
	action: OrionMessageAction['id'],
): 'site_type' | 'starter_pages' | null {
	if (action === 'edit_site_profile_site_type') return 'site_type';
	if (action === 'edit_site_profile_starter_pages') return 'starter_pages';
	return null;
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function currentCardDraftForSummary(
	summary: OrionSummary | null,
	cardKey: string | null | undefined,
): Record<string, unknown> | null {
	const card = getSiteProfileCardByKey(cardKey);
	if (!card) return null;
	const draft = card.draftFromSummary(summary);
	return isRecord(draft) ? draft : null;
}

export function siteProfileCardEntryMessage(
	card: SiteProfileCard,
	labels: OrionAssistantLabels,
): string {
	if (card.cardKey === SITE_PROFILE_SITE_TYPE_CARD_KEY) return labels.siteProfileTypeEntryMessage;
	return card.entryMessage;
}

export function siteProfileCardSuccessMessage(
	card: SiteProfileCard,
	labels: OrionAssistantLabels,
): string {
	if (card.cardKey === SITE_PROFILE_SITE_TYPE_CARD_KEY) return labels.siteProfileTypeSuccessMessage;
	return card.successMessage;
}

export async function confirmSiteProfileDraft(
	ui: Pick<
		SiteProfileStepUi,
		'createProposalErrorMessage' | 'createConfirmedMessage'
	>,
	{
		workflow,
		labels,
		setWorkflow,
		appendMessage,
	}: {
		workflow: OrionWorkflowState;
		labels: OrionAssistantLabels;
		setWorkflow: (workflow: OrionWorkflowState) => void;
		appendMessage: (message: OrionMessage) => void;
	},
): Promise<void> {
	if (!isSiteProfileSummary(workflow.summary)) return;
	if (!isSiteProfileProposal(workflow.proposal)) {
		appendMessage(ui.createProposalErrorMessage(labels));
		return;
	}

	const activeCard = getSiteProfileCard(workflow.activeCardKey || SITE_PROFILE_SITE_TYPE_CARD_KEY);
	const nextCard = getSiteProfileCardByKey(activeCard.nextCardKey);

	if (workflow.returnToFinalReview) {
		setWorkflow({
			...committedDraftWorkflow(workflow),
			step: 'confirmed',
			returnToFinalReview: false,
		});
		appendMessage(ui.createConfirmedMessage(labels));
		return;
	}

	if (nextCard) {
		setWorkflow(collectingWorkflow(committedDraftWorkflow(workflow), nextCard.cardKey, false));
		appendMessage({
			role: 'assistant',
			text: siteProfileCardSuccessMessage(activeCard, labels),
		});
		appendMessage({
			role: 'assistant',
			text: siteProfileCardEntryMessage(nextCard, labels),
		});
		return;
	}

	setWorkflow({
		...committedDraftWorkflow(workflow),
		step: 'confirmed',
		returnToFinalReview: false,
	});
	appendMessage(ui.createConfirmedMessage(labels));
}

export {
	createSiteProfileApplyErrorMessage,
	createSiteProfileApplySuccessMessage,
	createSiteProfileConfirmedMessage,
	createSiteProfileEditMessage,
	createSiteProfileProposalErrorMessage,
	createSiteProfileProposalMessage,
	createSiteProfileSummaryMessage,
	getSiteProfileCard,
	getSiteProfileCardByKey,
	getSiteProfileCardForSummary,
	isSiteProfileProposal,
	isSiteProfileSummary,
	mergeSiteProfileSummary,
	SITE_PROFILE_SITE_TYPE_CARD_KEY,
};
