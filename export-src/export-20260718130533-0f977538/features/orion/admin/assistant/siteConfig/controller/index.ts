import { isConfirmationIntent } from '../../../../core/workflow';
import type {
	DomainControllerAdapter,
	DomainTextIntentContext,
} from '../../shared/types/domainController';
import { siteConfigAssistant } from '..';
import { focusSiteConfigCard } from './focus';
import { resetSiteConfigAssistantState } from './reset';

function cardKeyForSiteConfigAction(action: string, activeCardKey: string | null | undefined): string | null {
	if (action === 'switch_to_branding') return 'branding';
	if (action === 'switch_to_typography') return 'typography';
	if (action === 'switch_to_theme') return 'theme';
	if (action === 'switch_to_components') return 'components';
	if (action === 'switch_to_seo') return 'seo';
	if (action === 'edit_summary') return typeof activeCardKey === 'string' ? activeCardKey : null;
	return null;
}

async function handleSiteConfigTextIntent({
	text,
	workflow,
	labels,
	appendMessage,
}: DomainTextIntentContext): Promise<boolean> {
	if (workflow.domain !== 'site_config' || workflow.step !== 'confirmed') return false;
	if (!isConfirmationIntent(text)) return false;

	appendMessage({
		role: 'assistant',
		text: labels.siteConfigAlreadyLoaded,
	});
	return true;
}

export const siteConfigDomainController: DomainControllerAdapter = {
	async handleAction({
		action,
		workflow,
		labels,
		pathname,
		setWorkflow,
		appendMessage,
		state,
	}): Promise<boolean> {
		if (workflow.domain !== 'site_config') return false;
		const handled = await siteConfigAssistant.handleAction({
			action,
			workflow,
			labels,
			pathname,
			setWorkflow,
			appendMessage,
			state,
		});
		if (!handled) return false;

		const cardKey = cardKeyForSiteConfigAction(action, workflow.activeCardKey);
		if (cardKey) focusSiteConfigCard(cardKey);
		return true;
	},

	async handleSubmit({ text, workflow, labels, pathname, setWorkflow, appendMessage }): Promise<boolean> {
		if (workflow.domain !== 'site_config') return false;
		return await siteConfigAssistant.handleSubmit({
			text,
			workflow,
			labels,
			pathname,
			setWorkflow,
			appendMessage,
		});
	},

	handleTextIntent: handleSiteConfigTextIntent,
	resetState: resetSiteConfigAssistantState,
};
