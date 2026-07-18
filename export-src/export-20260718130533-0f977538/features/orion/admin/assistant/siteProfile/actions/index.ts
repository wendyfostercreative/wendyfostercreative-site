import type { SiteProfileActionContext, SiteProfileStepUi } from '../workflow';
import {
	collectingWorkflow,
	editSiteProfileCardKeyFromAction,
	getSiteProfileCard,
	getSiteProfileCardByKey,
	getSiteProfileCardForSummary,
	isSiteProfileSummary,
	SITE_PROFILE_SITE_TYPE_CARD_KEY,
} from '../workflow';

export async function handleSiteProfileAction(
	ui: SiteProfileStepUi,
	{
		action,
		workflow,
		labels,
		setWorkflow,
		appendMessage,
	}: SiteProfileActionContext,
): Promise<boolean> {
	if (workflow.domain !== 'site_profile') return false;

	if (action === 'confirm_summary' || action === 'apply_proposal') {
		setWorkflow({
			...workflow,
			draftSummary: workflow.summary,
			draftProposal: workflow.proposal,
		});
		appendMessage(ui.createConfirmedMessage(labels));
		return true;
	}

	if (action === 'edit_summary') {
		const currentSummary = isSiteProfileSummary(workflow.summary) ? workflow.summary : null;
		const currentCard = currentSummary
			? getSiteProfileCardForSummary(currentSummary)
			: getSiteProfileCard(workflow.activeCardKey || SITE_PROFILE_SITE_TYPE_CARD_KEY);

		setWorkflow(collectingWorkflow(workflow, currentCard.cardKey, false));
		appendMessage(ui.createEditMessage(labels));
		return true;
	}

	const targetCardKey = editSiteProfileCardKeyFromAction(action);
	if (targetCardKey) {
		const targetCard = getSiteProfileCardByKey(targetCardKey);
		if (!targetCard) return true;
		setWorkflow(collectingWorkflow(workflow, targetCard.cardKey, true));
		appendMessage(ui.createEditMessage(labels));
		return true;
	}

	return false;
}
