import {
	getExportMediaCategoryRoutes,
	getExportMediaDetailRoutes,
	getExportPublicPagePaths,
	isExportSnapshotMode,
} from './data';

export function getExportPageStaticPaths(): Array<{ params: { path: string } }> {
	if (!isExportSnapshotMode()) return [];
	return getExportPublicPagePaths().map((path) => ({
		params: { path: path.replace(/^\/+/, '') },
	}));
}

export function getExportMediaCategoryStaticPaths(): Array<{ params: { collection: string; category: string } }> {
	if (!isExportSnapshotMode()) return [];
	return getExportMediaCategoryRoutes().map((route) => ({ params: route }));
}

export function getExportMediaDetailStaticPaths(): Array<{ params: { collection: string; category: string; slug: string } }> {
	if (!isExportSnapshotMode()) return [];
	return getExportMediaDetailRoutes().map((route) => ({ params: route }));
}
