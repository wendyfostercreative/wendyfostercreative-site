export function getAdminPagesIndexView(url: URL): {
	statusMessage: string;
	errorMessage: string;
	openCreate: boolean;
} {
	const statusMessage = String(url.searchParams.get('message') || '').trim();
	const errorMessage = String(url.searchParams.get('error') || '').trim();
	const openCreate = url.searchParams.get('create') === '1';
	return { statusMessage, errorMessage, openCreate };
}
