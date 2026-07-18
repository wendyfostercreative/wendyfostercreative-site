export type HeaderNavUpdatePayload = {
	layout_preset:
		| 'logo-site-inline-split'
		| 'logo-left-links-below-site-left'
		| 'logo-site-center-links-below-center'
		| 'stacked-centered';
	sticky: boolean;
	header_height: 'compact' | 'standard' | 'tall' | 'xtall';
	background_color: string | null;
	content_width: 'site' | 'wide' | 'full';
	text_direction: 'ltr' | 'rtl';

	show_site_name_with_logo: boolean;
	brand_font_size: 'sm' | 'md' | 'lg' | 'xl';
	brand_font_weight: 'normal' | 'medium' | 'semibold' | 'bold';
	brand_letter_spacing: 'narrow' | 'normal' | 'wide';
	brand_font_color: string | null;
	brand_gap: 'tight' | 'normal' | 'wide';
	brand_max_logo_height: 'sm' | 'md' | 'lg' | 'xl';

	nav_font_family: string | null;
	nav_font_size: 'sm' | 'md' | 'lg';
	nav_font_weight: 'normal' | 'medium' | 'semibold' | 'bold';
	nav_text_transform: 'none' | 'uppercase';
	nav_letter_spacing: 'narrow' | 'normal' | 'wide';
	link_spacing: 'tight' | 'normal' | 'wide';
	nav_font_color: string | null;
	nav_hover_color: string | null;

	show_bottom_border: boolean;
	border_color: string | null;
	border_thickness: 'none' | 'thin' | 'medium' | 'thick';
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

export function parseHeaderNavSettingsForm(form: FormData): HeaderNavUpdatePayload {
	const layout_preset = assertOneOf(
		readTrimmed(form, 'layout_preset'),
		[
			'logo-site-inline-split',
			'logo-left-links-below-site-left',
			'logo-site-center-links-below-center',
			'stacked-centered',
		] as const,
		'Layout preset',
	);

	const header_height = assertOneOf(
		readTrimmed(form, 'header_height'),
		['compact', 'standard', 'tall', 'xtall'] as const,
		'Header height',
	);

	const content_width = assertOneOf(
		readTrimmed(form, 'content_width'),
		['site', 'wide', 'full'] as const,
		'Content width',
	);

	const text_direction = assertOneOf(
		readTrimmed(form, 'text_direction'),
		['ltr', 'rtl'] as const,
		'Text direction',
	);

	const brand_font_size = assertOneOf(
		readTrimmed(form, 'brand_font_size'),
		['sm', 'md', 'lg', 'xl'] as const,
		'Brand font size',
	);

	const brand_font_weight = assertOneOf(
		readTrimmed(form, 'brand_font_weight'),
		['normal', 'medium', 'semibold', 'bold'] as const,
		'Brand font weight',
	);

	const brand_letter_spacing = assertOneOf(
		readTrimmed(form, 'brand_letter_spacing'),
		['narrow', 'normal', 'wide'] as const,
		'Brand letter spacing',
	);

	const brand_gap = assertOneOf(
		readTrimmed(form, 'brand_gap'),
		['tight', 'normal', 'wide'] as const,
		'Brand gap',
	);

	const brand_max_logo_height = assertOneOf(
		readTrimmed(form, 'brand_max_logo_height'),
		['sm', 'md', 'lg', 'xl'] as const,
		'Brand max logo height',
	);

	const nav_font_size = assertOneOf(
		readTrimmed(form, 'nav_font_size'),
		['sm', 'md', 'lg'] as const,
		'Nav font size',
	);

	const nav_font_weight = assertOneOf(
		readTrimmed(form, 'nav_font_weight'),
		['normal', 'medium', 'semibold', 'bold'] as const,
		'Nav font weight',
	);

	const nav_text_transform = assertOneOf(
		readTrimmed(form, 'nav_text_transform'),
		['none', 'uppercase'] as const,
		'Nav text transform',
	);

	const nav_letter_spacing = assertOneOf(
		readTrimmed(form, 'nav_letter_spacing'),
		['narrow', 'normal', 'wide'] as const,
		'Nav letter spacing',
	);

	const link_spacing = assertOneOf(
		readTrimmed(form, 'link_spacing'),
		['tight', 'normal', 'wide'] as const,
		'Link spacing',
	);

	const border_thickness = assertOneOf(
		readTrimmed(form, 'border_thickness'),
		['none', 'thin', 'medium', 'thick'] as const,
		'Border thickness',
	);

	return {
		layout_preset,
		sticky: parseBool(form, 'sticky'),
		header_height,
		background_color: readOptionalString(form, 'background_color'),
		content_width,
		text_direction,

		show_site_name_with_logo: parseBool(form, 'show_site_name_with_logo'),
		brand_font_size,
		brand_font_weight,
		brand_letter_spacing,
		brand_font_color: readOptionalString(form, 'brand_font_color'),
		brand_gap,
		brand_max_logo_height,

		nav_font_family: readOptionalString(form, 'nav_font_family'),
		nav_font_size,
		nav_font_weight,
		nav_text_transform,
		nav_letter_spacing,
		link_spacing,
		nav_font_color: readOptionalString(form, 'nav_font_color'),
		nav_hover_color: readOptionalString(form, 'nav_hover_color'),

		show_bottom_border: parseBool(form, 'show_bottom_border'),
		border_color: readOptionalString(form, 'border_color'),
		border_thickness,
	};
}