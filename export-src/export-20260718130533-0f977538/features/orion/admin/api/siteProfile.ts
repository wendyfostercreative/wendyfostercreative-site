import { apiFetch } from '../../../../lib/api';
import type {
	OrionSiteProfileDecision,
	OrionSiteProfileProposalResult,
	OrionSummary,
} from '../../core/workflow/siteProfile';
import type { BaseOptions } from '../../../../lib/types';

type SiteProfileDecisionData = {
	decision: OrionSiteProfileDecision;
};

type SiteProfileProposalData = OrionSiteProfileProposalResult;

type SiteProfileDecisionOptions = {
	cardKey?: string | null;
	currentCardDraft?: Record<string, unknown> | null;
	workflowId?: string | null;
};

type SiteProfileProposalOptions = SiteProfileDecisionOptions & {
	domainKey?: string | null;
	topic?: string | null;
	proposalTask?: string | null;
};

export async function decideSiteProfileRoute(
	message: string,
	currentDraft?: OrionSummary | null,
	options: SiteProfileDecisionOptions = {},
): Promise<OrionSiteProfileDecision> {
	const data = await apiFetch<SiteProfileDecisionData>('/orion/v1/site-profile/decide', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			message,
			current_draft: currentDraft ?? null,
			card_key: options.cardKey ?? null,
			current_card_draft: options.currentCardDraft ?? null,
			workflow_id: options.workflowId ?? null,
		}),
	});

	return data.decision;
}

export async function fetchSiteProfileProposal(
	message: string,
	currentSummary?: OrionSummary | null,
	options: SiteProfileProposalOptions = {},
): Promise<OrionSiteProfileProposalResult> {
	return await apiFetch<SiteProfileProposalData>('/orion/v1/site-profile/proposal', {
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
