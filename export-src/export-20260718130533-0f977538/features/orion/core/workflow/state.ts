import type { OrionWorkflowDomain, OrionWorkflowState } from '../types';
import { SITE_PROFILE_SITE_TYPE_CARD_KEY } from './siteProfile/cards/types';
import { HEADER_NAV_LAYOUT_CARD_KEY } from './headerNav';
import { SITE_CONFIG_BRANDING_CARD_KEY } from './siteConfig/cards/types';

export function defaultWorkflowState(): OrionWorkflowState {
	return {
		domain: 'admin_home',
		step: 'collecting',
		returnToFinalReview: false,
		summary: null,
		proposal: null,
		draftSummary: null,
		draftProposal: null,
	};
}

export function createWorkflowForDomain(domain: OrionWorkflowDomain): OrionWorkflowState {
	return {
		domain,
		step: 'collecting',
		activeCardKey:
			domain === 'site_profile'
				? SITE_PROFILE_SITE_TYPE_CARD_KEY
				: domain === 'site_config'
					? SITE_CONFIG_BRANDING_CARD_KEY
					: domain === 'header_nav'
						? HEADER_NAV_LAYOUT_CARD_KEY
						: null,
		returnToFinalReview: false,
		summary: null,
		proposal: null,
		draftSummary: null,
		draftProposal: null,
	};
}

export function workflowDomainForPath(pathname: string): OrionWorkflowDomain {
	if (pathname === '/admin' || pathname === '/admin/') return 'admin_home';
	if (pathname.startsWith('/admin/site-profile')) return 'site_profile';
	if (pathname.startsWith('/admin/site')) return 'site_config';
	if (pathname.startsWith('/admin/headerNav')) return 'header_nav';
	return 'site_profile';
}
