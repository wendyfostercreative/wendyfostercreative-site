import type { OrionWorkflowState } from '../../types';
import type { SiteProfile } from '../../../../siteProfile/core/types';
import {
	siteProfileDisplayFromProposal,
	siteProfileDisplayFromSummary,
	type SiteProfileDisplay,
} from './displayView';
import type { OrionSiteProfileProposal, OrionSummary } from './types';

export type StagedSiteProfileDisplay = {
	source: 'preview_proposal' | 'preview_summary' | 'staged_proposal' | 'staged_summary';
	workflowStep: OrionWorkflowState['step'];
	display: SiteProfileDisplay;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSiteProfileSummary(value: unknown): value is OrionSummary {
	if (!isRecord(value)) return false;
	return (
		typeof value.site_type === 'string' &&
		typeof value.business_type === 'string' &&
		typeof value.primary_work === 'string' &&
		typeof value.audience === 'string' &&
		Array.isArray(value.suggested_default_pages) &&
		Array.isArray(value.suggested_templates)
	);
}

function isSiteProfileProposal(value: unknown): value is OrionSiteProfileProposal {
	if (!isRecord(value)) return false;
	return (
		typeof value.profile_key === 'string' &&
		typeof value.label === 'string' &&
		typeof value.description === 'string' &&
		Array.isArray(value.default_pages)
	);
}

export function hasStagedSiteProfileDisplay(workflow: OrionWorkflowState | null | undefined): boolean {
	if (!workflow || workflow.domain !== 'site_profile' || workflow.step === 'applied') return false;
	return (
		isSiteProfileProposal(workflow.proposal) ||
		isSiteProfileSummary(workflow.summary) ||
		isSiteProfileProposal(workflow.draftProposal) ||
		isSiteProfileSummary(workflow.draftSummary)
	);
}

export function getStagedSiteProfileDisplay(
	workflow: OrionWorkflowState | null | undefined,
	saved: SiteProfile,
): StagedSiteProfileDisplay | null {
	if (!workflow || workflow.domain !== 'site_profile' || workflow.step === 'applied') return null;

	if (isSiteProfileProposal(workflow.proposal)) {
		return {
			source: 'preview_proposal',
			workflowStep: workflow.step,
			display: siteProfileDisplayFromProposal(workflow.proposal, saved),
		};
	}

	if (isSiteProfileSummary(workflow.summary)) {
		return {
			source: 'preview_summary',
			workflowStep: workflow.step,
			display: siteProfileDisplayFromSummary(workflow.summary, saved),
		};
	}

	if (isSiteProfileProposal(workflow.draftProposal)) {
		return {
			source: 'staged_proposal',
			workflowStep: workflow.step,
			display: siteProfileDisplayFromProposal(workflow.draftProposal, saved),
		};
	}

	if (isSiteProfileSummary(workflow.draftSummary)) {
		return {
			source: 'staged_summary',
			workflowStep: workflow.step,
			display: siteProfileDisplayFromSummary(workflow.draftSummary, saved),
		};
	}

	return null;
}
