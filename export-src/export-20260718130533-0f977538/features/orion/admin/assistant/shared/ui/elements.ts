export type AssistantElements = {
	root: HTMLElement;
	launcher: HTMLButtonElement | null;
	panel: HTMLElement | null;
	header: HTMLElement | null;
	form: HTMLFormElement | null;
	input: HTMLTextAreaElement | null;
	messagesEl: HTMLElement | null;
	collapseButton: HTMLElement | null;
	expandButton: HTMLElement | null;
	closeButton: HTMLElement | null;
	clearButton: HTMLElement | null;
};

export function getAssistantElements(root: HTMLElement): AssistantElements {
	return {
		root,
		launcher: document.getElementById('orion-launcher') as HTMLButtonElement | null,
		panel: document.getElementById('orion-panel') as HTMLElement | null,
		header: document.getElementById('orion-panel-header') as HTMLElement | null,
		form: document.getElementById('orion-form') as HTMLFormElement | null,
		input: document.getElementById('orion-input') as HTMLTextAreaElement | null,
		messagesEl: document.getElementById('orion-messages'),
		collapseButton: document.getElementById('orion-collapse'),
		expandButton: document.getElementById('orion-expand'),
		closeButton: document.getElementById('orion-close'),
		clearButton: document.getElementById('orion-clear'),
	};
}
