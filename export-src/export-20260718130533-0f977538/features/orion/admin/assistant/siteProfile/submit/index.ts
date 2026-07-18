import { decideSiteProfileRoute, fetchSiteProfileProposal } from '../../../api';
import type { SiteProfileStepUi, SiteProfileSubmitContext } from '../workflow';
import {
	currentCardDraftForSummary,
	getSiteProfileCard,
	getSiteProfileCardByKey,
	isSiteProfileSummary,
	siteProfileCardEntryMessage,
} from '../workflow';

export async function handleSiteProfileSubmit(
	ui: SiteProfileStepUi,
	{
		text,
		workflow,
		labels,
		setWorkflow,
		appendMessage,
	}: SiteProfileSubmitContext,
): Promise<boolean> {
	if (workflow.domain !== 'site_profile') return false;

	try {
		const currentSummary = isSiteProfileSummary(workflow.summary) ? workflow.summary : null;
		const activeCard = getSiteProfileCard(workflow.activeCardKey);
		const currentCardDraft = currentCardDraftForSummary(currentSummary, activeCard.cardKey);

		const decision = await decideSiteProfileRoute(text, currentSummary, {
			cardKey: activeCard.cardKey,
			currentCardDraft,
		});

		if (decision.mode === 'answer_question' && decision.answer) {
			appendMessage({
				role: 'assistant',
				text: decision.answer,
			});
			return true;
		}

		if (decision.mode === 'switch_card' && decision.target_card_key) {
			const targetCard = getSiteProfileCardByKey(decision.target_card_key);
			if (targetCard) {
				setWorkflow({
					...workflow,
					activeCardKey: targetCard.cardKey,
				});
				appendMessage({
					role: 'assistant',
					text: decision.answer || siteProfileCardEntryMessage(targetCard, labels),
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
			if (decision.mode === 'save_card' && currentSummary && workflow.proposal) {
				setWorkflow({
					...workflow,
					draftSummary: workflow.summary,
					draftProposal: workflow.proposal,
				});
				appendMessage(ui.createConfirmedMessage(labels));
				return true;
			}

			appendMessage({
				role: 'assistant',
				text: decision.answer || labels.editReply,
			});
			return true;
		}

		if (!decision.should_change_draft) {
			appendMessage({
				role: 'assistant',
				text: decision.answer || labels.editReply,
			});
			return true;
		}

		const result = await fetchSiteProfileProposal(decision.message || text, currentSummary, {
			domainKey: decision.domain_key,
			cardKey: decision.card_key || activeCard.cardKey,
			topic: decision.topic,
			proposalTask: decision.proposal_task,
			currentCardDraft,
			workflowId: decision.workflow_id ?? null,
		});
		const mergedSummary = ui.merge(workflow.summary, result.summary);
		setWorkflow({
			domain: workflow.domain,
			step: 'summary_ready',
			activeCardKey: decision.card_key || activeCard.cardKey,
			returnToFinalReview: workflow.returnToFinalReview ?? false,
			summary: mergedSummary,
			proposal: result.proposal,
		});
		appendMessage(ui.createSummaryMessage(mergedSummary, labels));
	} catch (error) {
		console.error('[orion] site_profile proposal failed', error);
		appendMessage({
			role: 'assistant',
			text: labels.summaryError,
		});
	}

	return true;
}
