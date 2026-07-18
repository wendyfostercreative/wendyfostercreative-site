import { decideSiteRoute, postSiteConfigProposal } from '../../../api';
import type { SiteConfigStepUi, SiteConfigSubmitContext } from '../workflow';
import {
	appendDecisionAnswer,
	confirmSiteConfigDraft,
	cardEntryText,
	currentCardDraftForSummary,
	currentSiteConfigSummary,
	getSiteConfigCard,
	getSiteConfigCardByKey,
	isCardOwnedApplyCard,
	cardOwnedApplyReminder,
	collectingWorkflow,
} from '../workflow';

export async function handleSiteConfigSubmit(
	ui: SiteConfigStepUi,
	{
		text,
		workflow,
		labels,
		setWorkflow,
		appendMessage,
	}: SiteConfigSubmitContext,
): Promise<boolean> {
	if (workflow.domain !== 'site_config') return false;

	try {
		const currentSummary = currentSiteConfigSummary(workflow);
		const activeCard = getSiteConfigCard(workflow.activeCardKey);
		const currentCardDraft = currentCardDraftForSummary(
			currentSummary,
			activeCard.cardKey,
		);
		const savedCardValues =
			workflow.step === 'applied'
				? currentCardDraftForSummary(currentSummary, activeCard.cardKey)
				: null;
		const decision = await decideSiteRoute(text, currentSummary, {
			cardKey: activeCard.cardKey,
			currentCardDraft,
			savedCardValues,
		});

		if (decision.mode === 'answer_question' && decision.answer) {
			appendMessage({
				role: 'assistant',
				text: decision.answer,
			});
			return true;
		}

		if (decision.mode === 'switch_card' && decision.target_card_key) {
			const targetCard = getSiteConfigCardByKey(decision.target_card_key);
			if (targetCard) {
				setWorkflow(collectingWorkflow(workflow, targetCard.cardKey));
				appendMessage({
					role: 'assistant',
					text: decision.answer || cardEntryText(targetCard.cardKey, labels),
				});
				return true;
			}
		}

		if (
			(decision.mode === 'redirect_domain' ||
				decision.mode === 'off_topic' ||
				decision.mode === 'save_card') &&
			!decision.should_change_draft
		) {
			if (
				decision.mode === 'save_card' &&
				isCardOwnedApplyCard(activeCard.cardKey)
			) {
				appendMessage({
					role: 'assistant',
					text: cardOwnedApplyReminder(activeCard.cardKey, labels),
				});
				return true;
			}

			if (decision.mode === 'save_card' && currentSummary && workflow.proposal) {
				await confirmSiteConfigDraft(ui, {
					workflow,
					labels,
					setWorkflow,
					appendMessage,
				});
				return true;
			}

			appendMessage({
				role: 'assistant',
				text: decision.answer || labels.editReply,
			});
			return true;
		}

		if (!decision.should_change_draft) {
			appendDecisionAnswer(decision, appendMessage, labels.editReply, labels);
			return true;
		}

		const nextCardKey = decision.card_key || activeCard.cardKey;
		const result = await postSiteConfigProposal(decision.message || text, currentSummary, {
			domainKey: decision.domain_key,
			cardKey: nextCardKey,
			topic: decision.topic,
			proposalTask: decision.proposal_task,
			currentCardDraft,
			workflowId: decision.workflow_id ?? null,
		});
		const mergedSummary = ui.merge(currentSummary, result.summary);
		setWorkflow({
			domain: workflow.domain,
			step: 'summary_ready',
			activeCardKey: nextCardKey,
			summary: mergedSummary,
			proposal: result.proposal,
			draftSummary: workflow.draftSummary ?? null,
			draftProposal: workflow.draftProposal ?? null,
		});
		appendMessage(ui.createSummaryMessage(mergedSummary, labels));
	} catch (error) {
		console.error('[orion] site proposal failed', error);
		appendMessage({
			role: 'assistant',
			text: labels.summaryError,
		});
	}

	return true;
}
