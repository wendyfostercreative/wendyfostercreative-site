import { readImageJson } from './readImageJson';

export function writeImageJson(editor: HTMLElement, hidden: HTMLTextAreaElement): void {
	hidden.value = JSON.stringify(readImageJson(editor), null, 2);
}
