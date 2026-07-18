import type {
	FooterContent,
	FooterCustomLink,
	FooterSettings,
	FooterSocialLink,
} from '../../core/types';

export type FooterUpdatePayload = Omit<FooterSettings, 'id' | 'updated_at'> & {
	content_json: FooterContent;
};

function parseBool(form: FormData, name: string): boolean {
	return form.get(name) === 'true';
}

function readTrimmed(form: FormData, name: string): string {
	return String(form.get(name) || '').trim();
}

function readOptionalString(form: FormData, name: string): string | null {
	const value = readTrimmed(form, name);
	return value ? value : null;
}

function assertOneOf<T extends string>(value: string, allowed: readonly T[], label: string): T {
	if ((allowed as readonly string[]).includes(value)) return value as T;
	throw new Error(`${label} must be one of: ${allowed.join(', ')}`);
}

function readJsonArray(form: FormData, name: string, label: string): unknown[] {
	const raw = readTrimmed(form, name);
	if (!raw) return [];

	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed)) return parsed;
		throw new Error(`${label} must be a JSON array.`);
	} catch (error) {
		if (error instanceof Error && error.message.endsWith('must be a JSON array.')) throw error;
		throw new Error(`${label} must be valid JSON.`);
	}
}

function readCustomLinks(form: FormData): FooterCustomLink[] {
	return readJsonArray(form, 'custom_links_json', 'Custom links') as FooterCustomLink[];
}

function readSocialLinks(form: FormData): FooterSocialLink[] {
	return readJsonArray(form, 'social_links_json', 'Social links') as FooterSocialLink[];
}

export function parseFooterSettingsForm(form: FormData): FooterUpdatePayload {
	return {
		enabled: parseBool(form, 'enabled'),
		layout_preset: assertOneOf(
			readTrimmed(form, 'layout_preset'),
			['minimal', 'brand-links-copyright', 'columns', 'centered'] as const,
			'Layout preset',
		),
		content_width: assertOneOf(
			readTrimmed(form, 'content_width'),
			['site', 'wide', 'full'] as const,
			'Content width',
		),
		background_color: readOptionalString(form, 'background_color'),
		text_color: readOptionalString(form, 'text_color'),
		text_direction: assertOneOf(
			readTrimmed(form, 'text_direction'),
			['ltr', 'rtl'] as const,
			'Text direction',
		),

		show_logo: parseBool(form, 'show_logo'),
		show_site_name: parseBool(form, 'show_site_name'),
		brand_layout: assertOneOf(
			readTrimmed(form, 'brand_layout'),
			['inline', 'stacked'] as const,
			'Brand layout',
		),
		logo_max_height: assertOneOf(
			readTrimmed(form, 'logo_max_height'),
			['sm', 'md', 'lg'] as const,
			'Logo size',
		),

		show_page_links: parseBool(form, 'show_page_links'),
		show_custom_links: parseBool(form, 'show_custom_links'),
		link_layout: assertOneOf(
			readTrimmed(form, 'link_layout'),
			['inline', 'columns', 'stacked'] as const,
			'Link layout',
		),

		show_tagline: parseBool(form, 'show_tagline'),
		show_social_links: parseBool(form, 'show_social_links'),
		show_copyright: parseBool(form, 'show_copyright'),

		show_top_border: parseBool(form, 'show_top_border'),
		border_color: readOptionalString(form, 'border_color'),
		border_thickness: assertOneOf(
			readTrimmed(form, 'border_thickness'),
			['none', 'thin', 'medium', 'thick'] as const,
			'Border thickness',
		),

		content_json: {
			tagline: readTrimmed(form, 'tagline'),
			custom_links: readCustomLinks(form),
			social_links: readSocialLinks(form),
			copyright: {
				mode: assertOneOf(
					readTrimmed(form, 'copyright_mode'),
					['generated', 'custom', 'hidden'] as const,
					'Copyright mode',
				),
				text: readTrimmed(form, 'copyright_text') || '\u00a9 {year} {site_name}',
			},
		},
	};
}
