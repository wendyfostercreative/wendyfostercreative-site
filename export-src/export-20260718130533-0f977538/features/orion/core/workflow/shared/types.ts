import type { OrionSiteProposal, OrionSiteSummary } from '../siteConfig/types';
import type { OrionSiteProfileProposal, OrionSummary } from '../siteProfile/types';

export type OrionWorkflowSummary = OrionSummary | OrionSiteSummary;

export type OrionWorkflowProposal = OrionSiteProfileProposal | OrionSiteProposal;
