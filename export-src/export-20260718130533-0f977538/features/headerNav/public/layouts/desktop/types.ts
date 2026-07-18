import type { NavItem } from '../../../core/types';

export interface DesktopHeaderLayoutProps {
	resolvedSiteName: string;
	resolvedLogoPath?: string;
	showLogo: boolean;
	showSiteNameText: boolean;
	enabledNavItems: NavItem[];
	brandStyle: string;
	logoStyle: string;
	navStyle: string;
	linkListStyle: string;
	linkStyle: string;
}
