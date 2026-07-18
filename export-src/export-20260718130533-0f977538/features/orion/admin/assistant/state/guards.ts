import type {
	OrionWorkflowState,
	OrionWorkflowSummary,
} from '../../../core/types';
import type { OrionSiteProposal, OrionSiteSummary } from '../../../core/workflow/siteConfig';
import type { OrionSiteProfileProposal, OrionSummary } from '../../../core/workflow/siteProfile';

export function isSiteProfileSummary(summary: OrionWorkflowSummary | null): summary is OrionSummary {
	return Boolean(summary && 'suggested_profile_key' in summary);
}

export function isSiteProfileProposal(proposal: OrionWorkflowState['proposal']): proposal is OrionSiteProfileProposal {
	return Boolean(proposal && 'profile_key' in proposal);
}

export function isSiteSummary(summary: OrionWorkflowSummary | null): summary is OrionSiteSummary {
	return Boolean(summary && 'site_name' in summary);
}

export function isSiteProposal(proposal: OrionWorkflowState['proposal']): proposal is OrionSiteProposal {
	return Boolean(proposal && 'default_seo_title' in proposal);
}
