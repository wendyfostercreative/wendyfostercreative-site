import {
	createWorkflowForDomain,
	isConfirmationIntent,
	isSiteConfigIntent,
} from '../../../../core/workflow';
import { normalizeIntentText } from '../../../../core/workflow/shared/text';
import type {
	DomainControllerAdapter,
	DomainTextIntentContext,
} from '../../shared/types/domainController';
import { createSiteConfigTransitionMessage } from '../../siteConfig/messages/bootstrap';
import { siteProfileAssistant } from '..';

function isExplicitSiteProfileApplyIntent(text: string): boolean {
	const normalized = normalizeIntentText(text);
	if (!normalized) return false;

	return [
		'save site profile',
		'save the site profile',
		'apply site profile',
		'apply the site profile',
	].includes(normalized);
}

async function handleSiteProfileTextIntent({
	text,
	workflow,
	labels,
	setWorkflow,
	appendMessage,
	updateVisibleWorkflowContext,
}: DomainTextIntentContext): Promise<boolean> {
	if (workflow.domain !== 'site_profile') return false;

	if (workflow.step === 'applied' && isSiteConfigIntent(text)) {
		setWorkflow(createWorkflowForDomain('site_config'));
		appendMessage(createSiteConfigTransitionMessage(labels));
		updateVisibleWorkflowContext();
		return true;
	}

	if (workflow.step === 'confirmed') {
		if (isConfirmationIntent(text) || isExplicitSiteProfileApplyIntent(text)) {
			appendMessage({
				role: 'assistant',
				text: labels.confirmedReview,
			});
			return true;
		}
	}

	if (workflow.step === 'proposal_ready' && workflow.proposal) {
		if (isConfirmationIntent(text)) {
			appendMessage({
				role: 'assistant',
				text: labels.readyReview,
			});
			return true;
		}

		if (isExplicitSiteProfileApplyIntent(text)) {
			appendMessage({
				role: 'assistant',
				text: labels.saveSettingsHint,
			});
			return true;
		}
	}

	return false;
}

export const siteProfileDomainController: DomainControllerAdapter = {
	async handleAction({ action, workflow, labels, setWorkflow, appendMessage }): Promise<boolean> {
		if (workflow.domain !== 'site_profile') return false;
		return await siteProfileAssistant.handleAction({
			action,
			workflow,
			labels,
			setWorkflow,
			appendMessage,
			onApplied() {
				window.location.reload();
			},
		});
	},

	async handleSubmit({ text, workflow, labels, pathname, setWorkflow, appendMessage }): Promise<boolean> {
		if (workflow.domain !== 'site_profile') return false;
		return await siteProfileAssistant.handleSubmit({
			text,
			workflow,
			labels,
			pathname,
			setWorkflow,
			appendMessage,
		});
	},

	handleTextIntent: handleSiteProfileTextIntent,
};
