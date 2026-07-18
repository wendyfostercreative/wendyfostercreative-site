import type { OrionAssistantLabels, OrionMessage, OrionPageContext } from '../../../../core/types';

export function createSiteProfileSeedMessage(
	context: OrionPageContext,
	labels: OrionAssistantLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: `${context.step}: ${context.title}

${labels.siteProfileTypeEntryMessage}`,
	};
}
