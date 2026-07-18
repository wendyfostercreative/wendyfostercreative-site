import { initImageLinksEditor } from './json/imageLinksEditor';
import { writeImageJson } from './json/writeImageJson';

export function initImageTemplateEditor(root: ParentNode | null = document): void {
	const editor = root?.querySelector?.('[data-image-template-editor]') as HTMLElement | null;
	if (!editor) return;

	const hidden = editor.querySelector('#contentJson') as HTMLTextAreaElement | null;
	if (!hidden) return;

	const form = editor.closest('form');
	const sync = () => writeImageJson(editor, hidden);

	editor.addEventListener('input', sync);
	editor.addEventListener('change', sync);
	form?.addEventListener('input', sync);
	form?.addEventListener('change', sync);
	form?.addEventListener('submit', sync);
	initImageLinksEditor(editor, sync);
	sync();
}
