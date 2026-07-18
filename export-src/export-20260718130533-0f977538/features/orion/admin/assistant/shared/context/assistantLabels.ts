import {
	buildSharedAssistantLabels,
	fallbackSharedLabels,
	type OrionAssistantUiLabels,
} from './labels';
import {
	buildAdminHomeAssistantLabels,
	fallbackAdminHomeLabels,
	type OrionAdminHomeLabels,
} from '../../adminHome/context/labels';
import {
	buildSiteProfileAssistantLabels,
	fallbackSiteProfileLabels,
	type OrionSiteProfileLabels,
} from '../../siteProfile/context/labels';
import {
	buildSiteConfigAssistantLabels,
	fallbackSiteConfigLabels,
	type OrionSiteConfigLabels,
} from '../../siteConfig/context/labels';
import {
	buildHeaderNavAssistantLabels,
	fallbackHeaderNavLabels,
	type OrionHeaderNavLabels,
} from '../../headerNav/context/labels';
import {
	buildSiteProfileWorkflowLabels,
	fallbackSiteProfileWorkflowLabels,
	type OrionSiteProfileWorkflowLabels,
} from '../../../../core/workflow/siteProfile/labels';
import {
	buildSiteConfigWorkflowLabels,
	fallbackSiteConfigWorkflowLabels,
	type OrionSiteConfigWorkflowLabels,
} from '../../../../core/workflow/siteConfig/labels';

type Translate = (key: string, fallback: string) => string;

export type OrionAssistantLabelPayload =
	& OrionAssistantUiLabels
	& OrionAdminHomeLabels
	& OrionSiteProfileLabels
	& OrionSiteConfigLabels
	& OrionHeaderNavLabels
	& OrionSiteProfileWorkflowLabels
	& OrionSiteConfigWorkflowLabels;

export function buildOrionAssistantLabels(t: Translate): OrionAssistantLabelPayload {
	return {
		...buildSharedAssistantLabels(t),
		...buildAdminHomeAssistantLabels(t),
		...buildSiteProfileAssistantLabels(t),
		...buildSiteConfigAssistantLabels(t),
		...buildHeaderNavAssistantLabels(t),
		...buildSiteProfileWorkflowLabels(t),
		...buildSiteConfigWorkflowLabels(t),
	};
}

export const fallbackLabels: OrionAssistantLabelPayload = {
	...fallbackSharedLabels,
	...fallbackAdminHomeLabels,
	...fallbackSiteProfileLabels,
	...fallbackSiteConfigLabels,
	...fallbackHeaderNavLabels,
	...fallbackSiteProfileWorkflowLabels,
	...fallbackSiteConfigWorkflowLabels,
};
