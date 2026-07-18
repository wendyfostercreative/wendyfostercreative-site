import type { ResolvedSiteTheme } from '../types';
import { siteThemeToTokens, siteTokensToCssVars } from '../../../../components/tokens';

export function siteThemeStyleVars(theme: ResolvedSiteTheme): string {
	return siteTokensToCssVars(siteThemeToTokens(theme));
}
