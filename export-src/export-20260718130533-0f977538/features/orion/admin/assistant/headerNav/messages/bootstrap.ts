import type { OrionAssistantLabels, OrionMessage, OrionPageContext } from '../../../../core/types';

export function createHeaderNavSeedMessage(
	context: OrionPageContext,
	labels: OrionAssistantLabels,
): OrionMessage {
	return {
		role: 'assistant',
		text: `${context.step}: ${context.title}\n\n${labels.headerNavEntry}`,
	};
}
