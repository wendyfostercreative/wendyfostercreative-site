const DEFAULT_PATH_HELP =
	'Paths are normalized before save: missing leading slashes are added, repeated slashes are collapsed, and trailing slashes are removed.';

function normalizePath(value: string): string {
	let next = String(value || '').trim();
	if (!next) return '/';
	if (!next.startsWith('/')) {
		next = `/${next}`;
	}
	next = next.replace(/\s+/g, '');
	next = next.replace(/\/+/g, '/');
	if (next !== '/') {
		next = next.replace(/\/+$/g, '');
	}
	return next || '/';
}

function reservedPathReason(path: string, template: string): string {
	if (path === '/' && template !== 'home') return 'The root path / is reserved for the Home template.';
	if (path === '/media') return 'The /media route is intentionally owned by media files.';
	if (path === '/photos') return 'The /photos route is intentionally owned by the photos landing page.';
	if (path === '/admin' || path.startsWith('/admin/')) return 'Admin routes are reserved for the application.';
	if (path === '/api' || path.startsWith('/api/')) return 'API routes are reserved for the application.';
	return DEFAULT_PATH_HELP;
}

export function initAdminPagesEditor(): void {
	const deleteButton = document.querySelector('[data-confirm-delete]');
	const pathInput = document.querySelector('#path');
	const pathPreview = document.querySelector('[data-path-preview]');
	const pathHelp = document.querySelector('[data-path-help]');

	if (pathInput instanceof HTMLInputElement) {
		const syncPathPreview = () => {
			const normalized = normalizePath(pathInput.value);
			const template = String(pathInput.dataset.template || '').trim().toLowerCase();
			const reason = reservedPathReason(normalized, template);
			if (pathPreview instanceof HTMLElement) {
				pathPreview.textContent = normalized;
			}
			if (pathHelp instanceof HTMLElement) {
				pathHelp.textContent = reason;
			}
			pathInput.setCustomValidity(reason !== DEFAULT_PATH_HELP ? reason : '');
		};

		pathInput.addEventListener('input', syncPathPreview);
		pathInput.addEventListener('blur', () => {
			pathInput.value = normalizePath(pathInput.value);
			syncPathPreview();
		});
		syncPathPreview();
	}

	if (deleteButton instanceof HTMLButtonElement) {
		deleteButton.addEventListener('click', (event) => {
			const confirmed = window.confirm(
				'Delete this page? This removes the route, navigation settings, SEO, and page content.',
			);
			if (!confirmed) {
				event.preventDefault();
			}
		});
	}
}
