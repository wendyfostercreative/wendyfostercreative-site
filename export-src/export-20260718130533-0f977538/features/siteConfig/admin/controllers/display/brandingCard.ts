import { removeMessageByReplaceKey, removeMessagesAtPath, upsertMessageAtPath } from '../../../../orion/admin/assistant/state/messages';
import { loadOrionState, saveOrionState } from '../../../../orion/core/storage';
import { createWorkflowHandoffMessage } from '../../../../orion/core/workflow/shared/handoff';
import { createWorkflowForDomain } from '../../../../orion/core/workflow/state';
import type { SiteConfigDisplayRuntime } from './types';
import { committedSiteConfigSummary, isRecord, scrollToSiteConfigCard, siteConfigSummaryFromSite } from './shared';

export function bindBrandingCardController(runtime: SiteConfigDisplayRuntime): void {
	const { elements, root } = runtime;

	elements.brandingApplyButton?.addEventListener('click', () => {
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
		const siteName = elements.siteNameInput?.value.trim() || 'My Site';
		const logoPath = elements.logoPathInput?.value.trim() || '';
		const logoAltText = elements.logoAltTextInput?.value.trim() || '';

		state.workflowsByPath[pathname] = {
			...workflow,
			domain: 'site_config',
			step: 'collecting',
			activeCardKey: 'typography',
			summary: null,
			proposal: null,
			draftSummary: {
				...baseSummary,
				site_name: siteName,
				logo_path: logoPath,
				logo_alt_text: logoAltText,
				model_input: {
					...(isRecord(baseSummary.model_input) ? baseSummary.model_input : {}),
					card_key: 'branding',
					card_summary: {
						site_name: siteName,
						logo_path: logoPath,
						logo_alt_text: logoAltText,
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
		removeMessageByReplaceKey(state, pathname, 'site-config-branding-handoff');
		upsertMessageAtPath(
			state,
			pathname,
			createWorkflowHandoffMessage({
				scope: 'card',
				headline: 'Branding applied. Next, choose the site typography.',
				body: 'This card sets the primary font, plus optional brand and nav fonts. Blank brand or nav fonts inherit the primary font.',
				actions: [
					{
						id: 'switch_to_branding',
						label: runtime.labels.goBack,
					},
				],
				replaceKey: 'site-config-branding-handoff',
			}),
		);
		removeMessageByReplaceKey(state, pathname, 'site-config-card-entry');
		saveOrionState(state);
		scrollToSiteConfigCard(root, 'typography');
	});
}
