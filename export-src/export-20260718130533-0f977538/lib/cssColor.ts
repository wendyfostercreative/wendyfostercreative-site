const HEX_3 = /^#?([0-9a-fA-F]{3})$/;
const HEX_6_OR_8 = /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/;
const RGB = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i;

function clampRgbPart(value: string): number | null {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed < 0 || parsed > 255) return null;
	return parsed;
}

function toHexPart(value: number): string {
	return value.toString(16).padStart(2, '0');
}

export function normalizeHexColor(value: string | null | undefined): string | null {
	const trimmed = String(value || '').trim();
	if (!trimmed) return null;

	const shortHex = trimmed.match(HEX_3);
	if (shortHex) {
		return `#${shortHex[1].split('').map((part) => `${part}${part}`).join('').toLowerCase()}`;
	}

	const longHex = trimmed.match(HEX_6_OR_8);
	if (longHex) return `#${longHex[1].toLowerCase()}`;

	const rgb = trimmed.match(RGB);
	if (rgb) {
		const red = clampRgbPart(rgb[1]);
		const green = clampRgbPart(rgb[2]);
		const blue = clampRgbPart(rgb[3]);
		if (red === null || green === null || blue === null) return null;
		return `#${toHexPart(red)}${toHexPart(green)}${toHexPart(blue)}`;
	}

	return null;
}

export function colorInputValue(value: string | null | undefined, fallback = '#000000'): string {
	return normalizeHexColor(value) ?? fallback;
}
