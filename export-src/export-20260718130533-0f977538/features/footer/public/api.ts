import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

import { getExportFooter, isExportSnapshotMode } from '../../export/data';
import { normalizeFooterSettings } from '../core/normalize';
import type { FooterSettings } from '../core/types';

export function getDefaultFooterSettings(): FooterSettings {
	return {
		id: 1,
		enabled: true,
		layout_preset: 'brand-links-copyright',
		content_width: 'site',
		background_color: null,
		text_color: null,
		text_direction: 'ltr',

		show_logo: false,
		show_site_name: true,
		brand_layout: 'stacked',
		logo_max_height: 'sm',

		show_page_links: true,
		show_custom_links: false,
		link_layout: 'inline',

		show_tagline: false,
		show_social_links: false,
		show_copyright: true,

		show_top_border: true,
		border_color: null,
		border_thickness: 'thin',

		content_json: {
			tagline: '',
			custom_links: [],
			social_links: [],
			copyright: {
				mode: 'generated',
				text: '\u00a9 {year} {site_name}',
			},
		},

		updated_at: undefined,
	};
}

export async function getFooterSettings(options: BaseOptions = {}): Promise<FooterSettings> {
	if (isExportSnapshotMode()) return getExportFooter();

	const data = await apiFetch<unknown>('/public/v1/footer', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});

	return normalizeFooterSettings(data);
}
