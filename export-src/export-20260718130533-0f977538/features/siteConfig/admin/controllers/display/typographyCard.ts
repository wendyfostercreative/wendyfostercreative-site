import { removeMessageByReplaceKey, removeMessagesAtPath, upsertMessageAtPath } from '../../../../orion/admin/assistant/state/messages';
import { loadOrionState, saveOrionState } from '../../../../orion/core/storage';
import { createWorkflowHandoffMessage } from '../../../../orion/core/workflow/shared/handoff';
import { createWorkflowForDomain } from '../../../../orion/core/workflow/state';
import type { SiteConfigDisplayRuntime } from './types';
import { committedSiteConfigSummary, isRecord, scrollToSiteConfigCard, siteConfigSummaryFromSite } from './shared';

export function bindTypographyCardController(runtime: SiteConfigDisplayRuntime): void {
	const { elements, root } = runtime;

	elements.typographyApplyButton?.addEventListener('click', () => {
		const state = loadOrionState();
		const pathname = '/admin/site';
		const currentWorkflow = state.workflowsByPath[pathname];
		const workflow =
			currentWorkflow?.domain === 'site_config'
				? currentWorkflow
				: createWorkflowForDomain('site_config');
		const baseSummary =
			currentWorkflow?.domain === 'site_config' && currentWorkflow.draftSummary
				? committedSiteConfigSummary(currentWorkflow.draftSummary)
				: siteConfigSummaryFromSite(runtime.savedSite);
		const primaryFont = elements.primaryFontInput?.value.trim() || '';
		const brandFont = elements.brandFontInput?.value.trim() || '';
		const navFont = elements.navFontInput?.value.trim() || '';

		state.workflowsByPath[pathname] = {
			...workflow,
			domain: 'site_config',
			step: 'collecting',
			activeCardKey: 'theme',
			summary: null,
			proposal: null,
			draftSummary: {
				...baseSummary,
				primary_font: primaryFont,
				brand_font: brandFont,
				site_name_font: brandFont,
				nav_font: navFont,
				font_preference: primaryFont,
				model_input: {
					...(isRecord(baseSummary.model_input) ? baseSummary.model_input : {}),
					card_key: 'typography',
					card_summary: {
						primary_font: primaryFont,
						brand_font: brandFont,
						nav_font: navFont,
					},
				},
			},
			draftProposal: null,
		};

		removeMessagesAtPath(
			state,
			pathname,
			(message) =>
				Boolean(message.review) &&
				Boolean(message.actions?.some((messageAction) => messageAction.id === 'edit_summary')),
		);
		removeMessageByReplaceKey(state, pathname, 'site-config-typography-handoff');
		upsertMessageAtPath(
			state,
			pathname,
			createWorkflowHandoffMessage({
				scope: 'card',
				headline: 'Typography applied. Next, choose the site theme.',
				body: 'This card sets the main site colors, including page, header, footer, and button styling.',
				actions: [
					{
						id: 'switch_to_typography',
						label: runtime.labels.goBack,
					},
				],
				replaceKey: 'site-config-typography-handoff',
			}),
		);
		removeMessageByReplaceKey(state, pathname, 'site-config-card-entry');
		saveOrionState(state);
		scrollToSiteConfigCard(root, 'theme');
	});
}
