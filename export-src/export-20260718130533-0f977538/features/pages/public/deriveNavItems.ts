import type { CmsPage } from '../core/types';
import type { NavItem } from '../../headerNav/core/types';

export function deriveNavItemsFromCmsPages(pages: CmsPage[]): NavItem[] {
	return [...pages]
		.filter((page) => page.published && page.show_in_nav)
		.sort((a, b) => {
			const a_order = typeof a.nav_order === 'number' ? a.nav_order : Number.MAX_SAFE_INTEGER;
			const b_order = typeof b.nav_order === 'number' ? b.nav_order : Number.MAX_SAFE_INTEGER;

			if (a_order !== b_order) return a_order - b_order;

			return a.path.localeCompare(b.path);
		})
		.map((page) => ({
			key: page.path || String(page.id),
			enabled: true,
			label: page.nav_label || page.title || page.path,
			href: page.path || '/',
		}));
}