import {
	createSiteConfigApplySuccessMessage,
	createSiteConfigConfirmedMessage,
	createSiteConfigProposalMessage,
	createSiteConfigSummaryMessage,
	getSiteConfigCard,
	getSiteConfigCardByKey,
	mergeSiteSummary,
} from '../../../../core/workflow/siteConfig';
import type {
	OrionAssistantLabels,
	OrionAssistantState,
	OrionMessage,
	OrionMessageAction,
	OrionWorkflowState,
	OrionWorkflowSummary,
} from '../../../../core/types';
import type {
	OrionSiteProposal,
	OrionSiteSummary,
} from '../../../../core/workflow/siteConfig';
import type { OrionStepController } from '../../shared/types/step';
import type { OrionSiteConfigLabels } from '../context/labels';
import { isSiteProposal, isSiteSummary } from '../../state/guards';

export type SiteConfigAssistantState = Pick<
	OrionAssistantState,
	'messagesByPath' | 'workflowsByPath'
>;

export type SiteConfigActionContext = {
	action: OrionMessageAction['id'];
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	pathname: string;
	setWorkflow: (workflow: OrionWorkflowState) => void;
	appendMessage: (message: OrionMessage) => void;
	state: SiteConfigAssistantState;
};

export type SiteConfigSubmitContext = {
	text: string;
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	pathname: string;
	setWorkflow: (workflow: OrionWorkflowState) => void;
	appendMessage: (message: OrionMessage) => void;
};

export type SiteConfigStepController = OrionStepController<
	OrionSiteSummary,
	OrionSiteProposal,
	SiteConfigSummarizeContext
> & {
	createEditMessage: (
		activeCardKey: string | null | undefined,
		labels: OrionSiteConfigLabels,
	) => OrionMessage;
	handleAction: (context: SiteConfigActionContext) => Promise<boolean>;
	handleSubmit: (context: SiteConfigSubmitContext) => Promise<boolean>;
};

export type SiteConfigSummarizeContext = {
	currentSummary?: OrionSiteSummary | null;
	cardKey?: string | null;
	currentCardDraft?: Record<string, unknown> | null;
};

export type SiteConfigStepUi = Pick<
	SiteConfigStepController,
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

export const SWITCH_ACTION_CARD_KEYS: Partial<
	Record<OrionMessageAction['id'], string>
> = {
	switch_to_branding: 'branding',
	switch_to_typography: 'typography',
	switch_to_theme: 'theme',
	switch_to_components: 'components',
	switch_to_seo: 'seo',
};

export function currentSiteConfigSummary(
	workflow: OrionWorkflowState,
): OrionSiteSummary | null {
	if (isSiteSummary(workflow.summary)) return workflow.summary;
	const draftSummary = workflow.draftSummary ?? null;
	if (isSiteSummary(draftSummary)) return draftSummary;
	return null;
}

export function committedDraftWorkflow(
	workflow: OrionWorkflowState,
): OrionWorkflowState {
	return {
		...workflow,
		draftSummary: workflow.summary,
		draftProposal: workflow.proposal,
		summary: null,
		proposal: null,
	};
}

export function collectingWorkflow(
	workflow: OrionWorkflowState,
	activeCardKey: string,
): OrionWorkflowState {
	return {
		...workflow,
		step: 'collecting',
		activeCardKey,
	};
}

export function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function currentCardDraftForSummary(
	summary: OrionSiteSummary | null,
	cardKey: string | null | undefined,
): Record<string, unknown> | null {
	const card = getSiteConfigCardByKey(cardKey);
	if (!card) return null;
	const draft = card.draftFromSummary(summary);
	return isRecord(draft) ? draft : null;
}

export function isCardOwnedApplyCard(
	cardKey: string | null | undefined,
): boolean {
	return (
		cardKey === 'branding' ||
		cardKey === 'typography' ||
		cardKey === 'theme' ||
		cardKey === 'components' ||
		cardKey === 'seo'
	);
}

export function cardOwnedApplyReminder(
	cardKey: string | null | undefined,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'seo') {
		return labels.siteConfigReminderSeo;
	}
	if (cardKey === 'components') {
		return labels.siteConfigReminderComponents;
	}
	if (cardKey === 'theme') {
		return labels.siteConfigReminderTheme;
	}
	if (cardKey === 'typography') {
		return labels.siteConfigReminderTypography;
	}
	return labels.siteConfigReminderBranding;
}

function cardEditPrompt(
	cardKey: string | null | undefined,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'branding') return labels.siteConfigEditBranding;
	if (cardKey === 'typography') return labels.siteConfigEditTypography;
	if (cardKey === 'theme') return labels.siteConfigEditTheme;
	if (cardKey === 'components') return labels.siteConfigEditComponents;
	if (cardKey === 'seo') return labels.siteConfigEditSeo;
	return labels.editReply;
}

export function cardEntryText(
	cardKey: string,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'branding') return labels.siteConfigEntryBranding;
	if (cardKey === 'typography') return labels.siteConfigEntryTypography;
	if (cardKey === 'theme') return labels.siteConfigEntryTheme;
	if (cardKey === 'components') return labels.siteConfigEntryComponents;
	if (cardKey === 'seo') return labels.siteConfigEntrySeo;
	return labels.siteConfigEntryBranding;
}

export function cardReturnText(
	cardKey: string,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'branding') {
		return labels.siteConfigReturnBranding;
	}
	if (cardKey === 'typography') {
		return labels.siteConfigReturnTypography;
	}
	if (cardKey === 'theme') {
		return labels.siteConfigReturnTheme;
	}
	if (cardKey === 'components') {
		return labels.siteConfigReturnComponents;
	}
	if (cardKey === 'seo') {
		return labels.siteConfigReturnSeo;
	}
	return labels.siteConfigReturnBranding;
}

export function cardSuccessText(
	cardKey: string,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'branding') return labels.siteConfigSuccessBranding;
	if (cardKey === 'typography') return labels.siteConfigSuccessTypography;
	if (cardKey === 'theme') return labels.siteConfigSuccessTheme;
	if (cardKey === 'components') return labels.siteConfigSuccessComponents;
	if (cardKey === 'seo') return labels.siteConfigSuccessSeo;
	return labels.siteConfigSuccessBranding;
}

export async function confirmSiteConfigDraft(
	ui: Pick<
		SiteConfigStepUi,
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
	if (!isSiteSummary(workflow.summary)) return;
	if (!isSiteProposal(workflow.proposal)) {
		appendMessage(ui.createProposalErrorMessage(labels));
		return;
	}

	const activeCard = getSiteConfigCard(workflow.activeCardKey);
	const nextCard = getSiteConfigCardByKey(activeCard.nextCardKey);

	if (isCardOwnedApplyCard(activeCard.cardKey)) {
		appendMessage({
			role: 'assistant',
			text: cardOwnedApplyReminder(activeCard.cardKey, labels),
		});
		return;
	}

	if (nextCard) {
		setWorkflow(collectingWorkflow(committedDraftWorkflow(workflow), nextCard.cardKey));
		appendMessage({
			role: 'assistant',
			text: cardSuccessText(activeCard.cardKey, labels),
		});
		appendMessage({
			role: 'assistant',
			text: cardEntryText(nextCard.cardKey, labels),
		});
		return;
	}

	setWorkflow({
		...committedDraftWorkflow(workflow),
		step: 'confirmed',
	});
	appendMessage(ui.createConfirmedMessage(labels));
}

export async function applyReadySiteConfigProposal(
	ui: Pick<
		SiteConfigStepUi,
		'createConfirmedMessage' | 'createApplyErrorMessage'
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
): Promise<boolean> {
	if (!isSiteProposal(workflow.proposal)) return false;

	try {
		setWorkflow({
			...committedDraftWorkflow(workflow),
			step: 'confirmed',
		});
		appendMessage(ui.createConfirmedMessage(labels));
	} catch (error) {
		console.error('[orion] site apply failed', error);
		appendMessage(ui.createApplyErrorMessage(labels));
	}

	return true;
}

function switchActionForDecision(decision: {
	offer_navigation?: boolean;
	target_card_key?: string | null;
}, labels: OrionSiteConfigLabels): OrionMessageAction | null {
	if (!decision.offer_navigation) return null;
	const targetCard = getSiteConfigCardByKey(decision.target_card_key);
	if (!targetCard) return null;

	const actionId = `switch_to_${targetCard.cardKey}` as OrionMessageAction['id'];
	if (!SWITCH_ACTION_CARD_KEYS[actionId]) return null;

	return {
		id: actionId,
		label: switchLabelForCard(targetCard.cardKey, labels),
	};
}

function switchLabelForCard(
	cardKey: string,
	labels: OrionSiteConfigLabels,
): string {
	if (cardKey === 'branding') return labels.siteConfigSwitchBranding;
	if (cardKey === 'typography') return labels.siteConfigSwitchTypography;
	if (cardKey === 'theme') return labels.siteConfigSwitchTheme;
	if (cardKey === 'components') return labels.siteConfigSwitchComponents;
	if (cardKey === 'seo') return labels.siteConfigSwitchSeo;
	return labels.editSummary;
}

export function appendDecisionAnswer(
	decision: {
		answer?: string | null;
		offer_navigation?: boolean;
		target_card_key?: string | null;
	},
	appendMessage: (message: OrionMessage) => void,
	fallbackText: string,
	labels: OrionSiteConfigLabels,
): void {
	const switchAction = switchActionForDecision(decision, labels);
	appendMessage({
		role: 'assistant',
		text: decision.answer || fallbackText,
		actions: switchAction ? [switchAction] : undefined,
	});
}

export function createSiteConfigEditMessage(
	activeCardKey: string | null | undefined,
	labels: OrionSiteConfigLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: cardEditPrompt(activeCardKey, labels),
	};
}

export {
	createSiteConfigApplySuccessMessage,
	createSiteConfigConfirmedMessage,
	createSiteConfigProposalMessage,
	createSiteConfigSummaryMessage,
	getSiteConfigCard,
	getSiteConfigCardByKey,
	isSiteProposal,
	isSiteSummary,
	mergeSiteSummary,
};
