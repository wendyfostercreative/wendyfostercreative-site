type Translate = (key: string, fallback: string) => string;

export type OrionAssistantUiLabels = {
	launcher: string;
	assistantTitle: string;
	answerLabel: string;
	placeholder: string;
	clear: string;
	continue: string;
	goBack: string;
	collapseLabel: string;
	expandLabel: string;
	closeLabel: string;
};

const labelDefinitions: Record<keyof OrionAssistantUiLabels, readonly [string, string]> = {
	launcher: ['admin.orion.assistant.launcher', 'Orion'],
	assistantTitle: ['admin.orion.assistant.title', 'Orion Assistant'],
	answerLabel: ['admin.orion.assistant.answer_label', 'Your answer'],
	placeholder: ['admin.orion.assistant.placeholder', 'Type naturally. Orion will ask for anything missing.'],
	clear: ['admin.orion.assistant.clear', 'Clear'],
	continue: ['admin.orion.assistant.continue', 'Continue'],
	goBack: ['admin.orion.assistant.go_back', 'Go back'],
	collapseLabel: ['admin.orion.assistant.collapse_label', 'Collapse assistant'],
	expandLabel: ['admin.orion.assistant.expand_label', 'Expand assistant'],
	closeLabel: ['admin.orion.assistant.close_label', 'Close assistant'],
};

export function buildSharedAssistantLabels(t: Translate): OrionAssistantUiLabels {
	return Object.fromEntries(
		Object.entries(labelDefinitions).map(([name, [key, fallback]]) => [name, t(key, fallback)]),
	) as OrionAssistantUiLabels;
}

export const fallbackSharedLabels = buildSharedAssistantLabels((_key, fallback) => fallback);
