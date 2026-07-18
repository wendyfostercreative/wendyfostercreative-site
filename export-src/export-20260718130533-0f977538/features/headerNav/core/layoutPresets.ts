import type { HeaderNavLayoutPreset } from './types';

export interface HeaderNavLayoutPresetDefinition {
	value: HeaderNavLayoutPreset;
	label: string;
	containerLayout: 'inline-split' | 'below' | 'stacked';
	brandAlign: 'start' | 'center';
	brandDirection: 'normal' | 'vertical';
	navAlign: 'start' | 'center' | 'end';
}

export const HEADER_NAV_LAYOUT_PRESETS: readonly HeaderNavLayoutPresetDefinition[] = [
	{
		value: 'logo-site-inline-split',
		label: 'Logo + site name left / nav right',
		containerLayout: 'inline-split',
		brandAlign: 'start',
		brandDirection: 'normal',
		navAlign: 'end',
	},
	{
		value: 'logo-left-links-below-site-left',
		label: 'Logo left / site name + links below left',
		containerLayout: 'below',
		brandAlign: 'start',
		brandDirection: 'normal',
		navAlign: 'start',
	},
	{
		value: 'logo-site-center-links-below-center',
		label: 'Logo + site name centered / links below',
		containerLayout: 'below',
		brandAlign: 'center',
		brandDirection: 'normal',
		navAlign: 'center',
	},
	{
		value: 'stacked-centered',
		label: 'Stacked centered',
		containerLayout: 'stacked',
		brandAlign: 'center',
		brandDirection: 'vertical',
		navAlign: 'center',
	},
] as const;

const DEFAULT_HEADER_NAV_LAYOUT_PRESET = HEADER_NAV_LAYOUT_PRESETS[0];

export function getHeaderNavLayoutPreset(
	value: string | null | undefined,
): HeaderNavLayoutPresetDefinition {
	if (!value) return DEFAULT_HEADER_NAV_LAYOUT_PRESET;

	return (
		HEADER_NAV_LAYOUT_PRESETS.find((preset) => preset.value === value) ??
		DEFAULT_HEADER_NAV_LAYOUT_PRESET
	);
}