import { apiFetch } from '../../../../lib/api';
import type {
	OrionSiteDecision,
	OrionSitePostProposalResult,
	OrionSiteSummary,
} from '../../core/workflow/siteConfig';

type SiteDecisionData = {
	decision: OrionSiteDecision;
};

type SitePostProposalData = OrionSitePostProposalResult;

export async function postSiteConfigProposal(
	message: string,
	currentSummary?: OrionSiteSummary | null,
	options: SiteDecisionOptions = {},
): Promise<OrionSitePostProposalResult> {
	return await apiFetch<SitePostProposalData>('/orion/v1/site-config/proposal', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message,
			current_summary: currentSummary ?? null,
			domain_key: options.domainKey ?? null,
			card_key: options.cardKey ?? null,
			topic: options.topic ?? null,
			proposal_task: options.proposalTask ?? null,
			current_card_draft: options.currentCardDraft ?? null,
			workflow_id: options.workflowId ?? null,
		}),
	});
}

type SiteDecisionOptions = {
	domainKey?: string | null;
	cardKey?: string | null;
	topic?: string | null;
	proposalTask?: string | null;
	currentCardDraft?: Record<string, unknown> | null;
	savedCardValues?: Record<string, unknown> | null;
	workflowId?: string | null;
};

export async function decideSiteRoute(
	message: string,
	currentDraft?: OrionSiteSummary | null,
	options: SiteDecisionOptions = {},
): Promise<OrionSiteDecision> {
	const data = await apiFetch<SiteDecisionData>('/orion/v1/site-config/decide', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message,
			current_draft: currentDraft ?? null,
			card_key: options.cardKey ?? null,
			current_card_draft: options.currentCardDraft ?? null,
			saved_card_values: options.savedCardValues ?? null,
			workflow_id: options.workflowId ?? null,
		}),
	});

	return data.decision;
}
