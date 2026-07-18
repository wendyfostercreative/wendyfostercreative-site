import type { ResolvedSiteTheme } from '../types';
import { siteFontOptionForKey, DEFAULT_SITE_FONT_KEY } from './fonts';

const defaultFontStack = siteFontOptionForKey(DEFAULT_SITE_FONT_KEY).stack;

export const DEFAULT_SITE_THEME: ResolvedSiteTheme = {
	fonts: {
		primary: defaultFontStack,
		brand: defaultFontStack,
		nav: defaultFontStack,
	},
	colors: {
		page: {
			bg: '#fffef4',
			panel: '#f3f7d9',
			text: '#243018',
			text_muted: '#556348',
			border: '#7a8b4d',
		},
		header: {
			bg: '#f8f3c4',
			text: '#243018',
			border: '#7a8b4d',
		},
		footer: {
			bg: '#dbe6b0',
			text: '#2b381c',
			border: '#6e8046',
		},
		button: {
			bg: '#556b2f',
			bg_hover: '#445625',
			text: '#fffef4',
			text_hover: '#fffef4',
		},
	},
	layout: {
		container_width: '72rem',
		content_width: '48rem',
	},
	radius: {
		card: '1rem',
		button: '0.5rem',
		input: '6px',
	},
};
