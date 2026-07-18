import { normalizeIntentText } from '../../../../core/workflow/shared/text';
import type {
	DomainControllerAdapter,
	DomainTextIntentContext,
} from '../../shared/types/domainController';
import { createHeaderNavSeedMessage } from '../messages/bootstrap';

function answerForHeaderNavText(text: string, labels: DomainTextIntentContext['labels']): string {
	const normalized = normalizeIntentText(text);
	if (normalized.includes('layout')) return labels.headerNavLayoutHelp;
	if (normalized.includes('brand') || normalized.includes('logo') || normalized.includes('site name')) return labels.headerNavBrandHelp;
	if (normalized.includes('navigation') || normalized.includes('nav') || normalized.includes('menu') || normalized.includes('link')) return labels.headerNavNavigationHelp;
	if (normalized.includes('border') || normalized.includes('line')) return labels.headerNavBorderHelp;
	if (normalized.includes('save') || normalized.includes('apply') || normalized.includes('speichern')) return labels.headerNavSaveHint;
	return labels.headerNavSaveHint;
}

async function handleHeaderNavTextIntent({
	text,
	workflow,
	labels,
	appendMessage,
}: DomainTextIntentContext): Promise<boolean> {
	if (workflow.domain !== 'header_nav') return false;
	appendMessage({
		role: 'assistant',
		text: answerForHeaderNavText(text, labels),
	});
	return true;
}

export const headerNavDomainController: DomainControllerAdapter = {
	async handleAction(): Promise<boolean> {
		return false;
	},

	async handleSubmit(context): Promise<boolean> {
		return await handleHeaderNavTextIntent({
			...context,
			state: { messagesByPath: {}, workflowsByPath: {} },
			updateVisibleWorkflowContext() {},
		});
	},

	handleTextIntent: handleHeaderNavTextIntent,

	resetState({ pathname, context, labels, state }): boolean {
		state.messagesByPath[pathname] = [createHeaderNavSeedMessage(context, labels)];
		return true;
	},
};
