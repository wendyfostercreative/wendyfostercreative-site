export function footerLogoHeightToCssValue(preset: unknown): string {
	if (preset === 'md') return '36px';
	if (preset === 'lg') return '48px';
	return '28px'; // sm
}

export function footerBorderThicknessToCssValue(preset: unknown): string {
	if (preset === 'none') return '0px';
	if (preset === 'medium') return '2px';
	if (preset === 'thick') return '3px';
	return '1px'; // thin
}

export function footerLinkGapToCssValue(preset: unknown): string {
	if (preset === 'columns') return '1rem 2rem';
	if (preset === 'stacked') return '0.5rem';
	return '1rem'; // inline
}
