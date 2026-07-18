import { removeMessageByReplaceKey, removeMessagesAtPath, upsertMessageAtPath } from '../../../../orion/admin/assistant/state/messages';
import { loadOrionState, saveOrionState } from '../../../../orion/core/storage';
import { createWorkflowHandoffMessage } from '../../../../orion/core/workflow/shared/handoff';
import { createWorkflowForDomain } from '../../../../orion/core/workflow/state';
import type { SiteConfigDisplayRuntime } from './types';
import { committedSiteConfigSummary, isRecord, scrollToSiteConfigCard, siteConfigSummaryFromSite } from './shared';

export function bindComponentsCardController(runtime: SiteConfigDisplayRuntime): void {
	const { elements, root } = runtime;

	elements.componentsApplyButton?.addEventListener('click', () => {
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
		const componentsSummary = {
			container_width: (root.querySelector<HTMLInputElement>('#theme_layout_container_width')?.value ?? '').trim(),
			content_width: (root.querySelector<HTMLInputElement>('#theme_layout_content_width')?.value ?? '').trim(),
			card_radius: (root.querySelector<HTMLInputElement>('#theme_radius_card')?.value ?? '').trim(),
			button_radius: (root.querySelector<HTMLInputElement>('#theme_radius_button')?.value ?? '').trim(),
			input_radius: (root.querySelector<HTMLInputElement>('#theme_radius_input')?.value ?? '').trim(),
		};

		state.workflowsByPath[pathname] = {
			...workflow,
			domain: 'site_config',
			step: 'collecting',
			activeCardKey: 'seo',
			summary: null,
			proposal: null,
			draftSummary: {
				...baseSummary,
				container_width: componentsSummary.container_width,
				content_width: componentsSummary.content_width,
				card_radius: componentsSummary.card_radius,
				button_radius: componentsSummary.button_radius,
				input_radius: componentsSummary.input_radius,
				model_input: {
					...(isRecord(baseSummary.model_input) ? baseSummary.model_input : {}),
					card_key: 'components',
					card_summary: componentsSummary,
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
		removeMessageByReplaceKey(state, pathname, 'site-config-components-handoff');
		upsertMessageAtPath(
			state,
			pathname,
			createWorkflowHandoffMessage({
				scope: 'card',
				headline: 'Components applied. Next, set the default SEO.',
				body: 'This card sets the default search title and description for the whole site.',
				actions: [
					{
						id: 'switch_to_components',
						label: runtime.labels.goBack,
					},
				],
				replaceKey: 'site-config-components-handoff',
			}),
		);
		removeMessageByReplaceKey(state, pathname, 'site-config-card-entry');
		saveOrionState(state);
		scrollToSiteConfigCard(root, 'seo');
	});
}
