export type {
	OrionWorkflowProposal,
	OrionWorkflowSummary,
} from './workflow/shared/types';

import type {
	OrionWorkflowProposal,
	OrionWorkflowSummary,
} from './workflow/shared/types';
import type { OrionAssistantLabelPayload } from '../admin/assistant/shared/context/assistantLabels';
import type { OrionHeaderNavLabels } from '../admin/assistant/headerNav/context/labels';
import type { OrionSiteConfigLabels } from '../admin/assistant/siteConfig/context/labels';
import type { OrionSiteProfileLabels } from '../admin/assistant/siteProfile/context/labels';
import type { OrionSiteConfigWorkflowLabels } from './workflow/siteConfig/labels';
import type { OrionSiteProfileWorkflowLabels } from './workflow/siteProfile/labels';

export type OrionPageContext = {
	key: string;
	step: string;
	title: string;
	goal: string;
	prompt: string;
	allowedActions: string[];
};

export type OrionMessage = {
	role: 'assistant' | 'user';
	text: string;
	review?: OrionReviewCard;
	handoff?: OrionWorkflowHandoff;
	actions?: OrionMessageAction[];
	replaceKey?: string;
};

export type OrionMessageAction = {
	id:
		| 'start_step_01'
		| 'route_to_step'
		| 'confirm_summary'
		| 'edit_summary'
		| 'edit_site_profile_site_type'
		| 'edit_site_profile_starter_pages'
		| 'apply_proposal'
		| 'switch_to_branding'
		| 'switch_to_typography'
		| 'switch_to_theme'
		| 'switch_to_components'
		| 'switch_to_seo';
	label: string;
	href?: string;
};

export type OrionReviewCard = {
	eyebrow?: string;
	title: string;
	description?: string;
	sections: OrionReviewSection[];
};

export type OrionReviewSection = {
	title: string;
	rows: OrionReviewRow[];
};

export type OrionReviewRow = {
	label: string;
	value: string | string[];
};

export type OrionWorkflowHandoff = {
	kind: 'workflow_handoff';
	scope: 'card' | 'step';
	label?: string;
	headline: string;
	body: string;
};

export type OrionWorkflowDomain = 'admin_home' | 'site_profile' | 'site_config' | 'header_nav';

export type OrionWorkflowStep = 'collecting' | 'summary_ready' | 'confirmed' | 'proposal_ready' | 'applied';

export type OrionWorkflowState = {
	domain: OrionWorkflowDomain;
	step: OrionWorkflowStep;
	activeCardKey?: string | null;
	returnToFinalReview?: boolean;
	summary: OrionWorkflowSummary | null;
	proposal: OrionWorkflowProposal | null;
	draftSummary?: OrionWorkflowSummary | null;
	draftProposal?: OrionWorkflowProposal | null;
};

export type OrionAssistantState = {
	enabled: boolean;
	open: boolean;
	expanded: boolean;
	position: { left: number; top: number } | null;
	messagesByPath: Record<string, OrionMessage[]>;
	workflowsByPath: Record<string, OrionWorkflowState>;
};

export type OrionLabels = OrionSiteProfileLabels & OrionSiteConfigLabels & OrionHeaderNavLabels;

export type OrionWorkflowLabels = OrionSiteProfileWorkflowLabels & OrionSiteConfigWorkflowLabels;

export type OrionAssistantLabels = OrionAssistantLabelPayload;
