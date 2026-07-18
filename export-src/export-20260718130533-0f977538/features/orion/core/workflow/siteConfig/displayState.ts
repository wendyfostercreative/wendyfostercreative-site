import type { OrionWorkflowState } from '../../types';
import type { SiteConfig } from '../../../../siteConfig/core/types';
import {
	siteConfigDisplayFromProposal,
	siteConfigDisplayFromSummary,
	type SiteConfigDisplay,
} from './displayView';
import type { OrionSiteProposal, OrionSiteSummary } from './types';

export type StagedSiteConfigDisplay = {
	source: 'preview_proposal' | 'preview_summary' | 'staged_proposal' | 'staged_summary';
	workflowStep: OrionWorkflowState['step'];
	display: SiteConfigDisplay;
};

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isSiteConfigSummary(value: unknown): value is OrionSiteSummary {
	if (!isRecord(value)) return false;
	return typeof value.site_name === 'string' && Array.isArray(value.missing_fields);
}

function isSiteConfigProposal(value: unknown): value is OrionSiteProposal {
	if (!isRecord(value)) return false;
	return typeof value.site_name === 'string' && 'metadata' in value;
}

export function hasStagedSiteConfigDisplay(workflow: OrionWorkflowState | null | undefined): boolean {
	if (!workflow || workflow.domain !== 'site_config' || workflow.step === 'applied') return false;
	return (
		isSiteConfigProposal(workflow.proposal) ||
		isSiteConfigSummary(workflow.summary) ||
		isSiteConfigProposal(workflow.draftProposal) ||
		isSiteConfigSummary(workflow.draftSummary)
	);
}

function committedPreviewBaseSite(
	workflow: OrionWorkflowState,
	saved: SiteConfig,
): SiteConfig {
	if (isSiteConfigSummary(workflow.draftSummary)) {
		return siteConfigDisplayFromSummary(workflow.draftSummary, saved).site;
	}

	if (isSiteConfigProposal(workflow.draftProposal)) {
		return siteConfigDisplayFromProposal(workflow.draftProposal, saved).site;
	}

	return saved;
}

export function getStagedSiteConfigDisplay(
	workflow: OrionWorkflowState | null | undefined,
	saved: SiteConfig,
): StagedSiteConfigDisplay | null {
	if (!workflow || workflow.domain !== 'site_config' || workflow.step === 'applied') return null;
	const previewBase = committedPreviewBaseSite(workflow, saved);

	if (isSiteConfigSummary(workflow.summary)) {
		return {
			source: 'preview_summary',
			workflowStep: workflow.step,
			display: siteConfigDisplayFromSummary(workflow.summary, previewBase),
		};
	}

	if (isSiteConfigProposal(workflow.proposal)) {
		return {
			source: 'preview_proposal',
			workflowStep: workflow.step,
			display: siteConfigDisplayFromProposal(workflow.proposal, previewBase),
		};
	}

	if (isSiteConfigSummary(workflow.draftSummary)) {
		return {
			source: 'staged_summary',
			workflowStep: workflow.step,
			display: siteConfigDisplayFromSummary(workflow.draftSummary, saved),
		};
	}

	if (isSiteConfigProposal(workflow.draftProposal)) {
		return {
			source: 'staged_proposal',
			workflowStep: workflow.step,
			display: siteConfigDisplayFromProposal(workflow.draftProposal, saved),
		};
	}

	return null;
}
