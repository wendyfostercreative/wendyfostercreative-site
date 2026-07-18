import {
	removeMessagesAtPath,
	replaceLastMessageAtPath,
	upsertMessageAtPath,
} from '../../state/messages';
import type { SiteConfigActionContext, SiteConfigStepUi } from '../workflow';
import {
	SWITCH_ACTION_CARD_KEYS,
	applyReadySiteConfigProposal,
	cardEntryText,
	cardReturnText,
	cardOwnedApplyReminder,
	collectingWorkflow,
	confirmSiteConfigDraft,
	getSiteConfigCard,
	getSiteConfigCardByKey,
	isCardOwnedApplyCard,
} from '../workflow';

export async function handleSiteConfigAction(
	ui: SiteConfigStepUi,
	{
		action,
		workflow,
		labels,
		pathname,
		setWorkflow,
		appendMessage,
		state,
	}: SiteConfigActionContext,
): Promise<boolean> {
	if (workflow.domain !== 'site_config') return false;

	const switchCardKey = SWITCH_ACTION_CARD_KEYS[action];
	if (switchCardKey) {
		const targetCard = getSiteConfigCardByKey(switchCardKey);
		if (!targetCard) return true;

		setWorkflow({
			...workflow,
			step: 'collecting',
			activeCardKey: targetCard.cardKey,
			summary: null,
			proposal: null,
		});

		removeMessagesAtPath(
			state,
			pathname,
			(message) => message.text === cardEntryText(targetCard.cardKey, labels),
		);
		removeMessagesAtPath(
			state,
			pathname,
			(message) =>
				Boolean(message.review) &&
				Boolean(
					message.actions?.some(
						(messageAction) => messageAction.id === 'edit_summary',
					),
				),
		);
		removeMessagesAtPath(
			state,
			pathname,
			(message) =>
				Boolean(message.handoff) &&
				Boolean(
					message.actions?.some((messageAction) => messageAction.id === action),
				),
		);
		upsertMessageAtPath(state, pathname, {
			role: 'assistant',
			text: cardReturnText(targetCard.cardKey, labels),
			replaceKey: 'site-config-card-entry',
		});
		return true;
	}

	if (action === 'confirm_summary') {
		if (isCardOwnedApplyCard(workflow.activeCardKey)) {
			appendMessage({
				role: 'assistant',
				text: cardOwnedApplyReminder(workflow.activeCardKey, labels),
			});
			return true;
		}
		await confirmSiteConfigDraft(ui, {
			workflow,
			labels,
			setWorkflow,
			appendMessage,
		});
		return true;
	}

	if (action === 'edit_summary') {
		const activeCardKey = workflow.activeCardKey || getSiteConfigCard(null).cardKey;
		setWorkflow(collectingWorkflow(workflow, activeCardKey));
		replaceLastMessageAtPath(
			state,
			pathname,
			(message) =>
				Boolean(message.review) &&
				Boolean(
					message.actions?.some(
						(messageAction) => messageAction.id === 'edit_summary',
					),
				),
			ui.createEditMessage(activeCardKey, labels),
		);
		return true;
	}

	if (action === 'apply_proposal') {
		await applyReadySiteConfigProposal(ui, {
			workflow,
			labels,
			setWorkflow,
			appendMessage,
		});
		return true;
	}

	return false;
}
