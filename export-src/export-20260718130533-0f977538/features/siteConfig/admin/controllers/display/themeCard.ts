import { removeMessageByReplaceKey, removeMessagesAtPath, upsertMessageAtPath } from '../../../../orion/admin/assistant/state/messages';
import { loadOrionState, saveOrionState } from '../../../../orion/core/storage';
import { createWorkflowHandoffMessage } from '../../../../orion/core/workflow/shared/handoff';
import { createWorkflowForDomain } from '../../../../orion/core/workflow/state';
import { SITE_THEME_COLOR_KEYS } from '../../forms/themeFields';
import type { SiteConfigDisplayRuntime } from './types';
import { committedSiteConfigSummary, isRecord, scrollToSiteConfigCard, siteConfigSummaryFromSite } from './shared';

export function bindThemeCardController(runtime: SiteConfigDisplayRuntime): void {
	const { elements, root } = runtime;

	elements.themeApplyButton?.addEventListener('click', () => {
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
		const themeSummary = Object.fromEntries(
			SITE_THEME_COLOR_KEYS.map((key) => [
				key,
				(root.querySelector<HTMLInputElement>(`#theme_colors_${key}`)?.value ?? '').trim(),
			]),
		) as Record<(typeof SITE_THEME_COLOR_KEYS)[number], string>;

		state.workflowsByPath[pathname] = {
			...workflow,
			domain: 'site_config',
			step: 'collecting',
			activeCardKey: 'components',
			summary: null,
			proposal: null,
			draftSummary: {
				...baseSummary,
				...themeSummary,
				model_input: {
					...(isRecord(baseSummary.model_input) ? baseSummary.model_input : {}),
					card_key: 'theme',
					card_summary: {
						primary_color: baseSummary.primary_color,
						accent_color: baseSummary.accent_color,
						theme_mode: baseSummary.theme_mode,
						...themeSummary,
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
		removeMessageByReplaceKey(state, pathname, 'site-config-theme-handoff');
		upsertMessageAtPath(
			state,
			pathname,
			createWorkflowHandoffMessage({
				scope: 'card',
				headline: 'Theme applied. Next, choose the shared components style.',
				body: 'This card controls layout width plus shared corner styling for cards, buttons, and inputs.',
				actions: [
					{
						id: 'switch_to_theme',
						label: runtime.labels.goBack,
					},
				],
				replaceKey: 'site-config-theme-handoff',
			}),
		);
		removeMessageByReplaceKey(state, pathname, 'site-config-card-entry');
		saveOrionState(state);
		scrollToSiteConfigCard(root, 'components');
	});
}
