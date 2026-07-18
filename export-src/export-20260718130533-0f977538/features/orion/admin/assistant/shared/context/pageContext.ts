import type { OrionPageContext, OrionWorkflowDomain } from '../../../../core/types';
import { adminHomeFallbackPageContext, adminHomePageContext } from '../../adminHome/context/pageContext';
import type { OrionAssistantLabels } from '../../../../core/types';
import { headerNavContextForLabels, headerNavPageContext } from '../../headerNav/context/pageContext';
import { siteConfigContextForLabels, siteConfigPageContext } from '../../siteConfig/context/pageContext';
import { siteProfilePageContext } from '../../siteProfile/context/pageContext';
import type { OrionPageContextSeed } from '../types/pageContext';

export const assistantFallbackPageContext: OrionPageContext = adminHomeFallbackPageContext;

export function getAssistantPageContext(pathname: string): OrionPageContextSeed {
	if (pathname === '/admin' || pathname === '/admin/') return adminHomePageContext;
	if (pathname.startsWith('/admin/site-profile')) return siteProfilePageContext;
	if (pathname.startsWith('/admin/site')) return siteConfigPageContext;
	if (pathname.startsWith('/admin/headerNav')) return headerNavPageContext;
	return adminHomePageContext;
}

export function getVisiblePageContext(
	domain: OrionWorkflowDomain,
	baseContext: OrionPageContext,
	labels: OrionAssistantLabels,
): OrionPageContext {
	if (domain === 'site_config') {
		return siteConfigContextForLabels(labels);
	}
	if (domain === 'header_nav') {
		return headerNavContextForLabels(labels);
	}
	return baseContext;
}

export function applyVisibleContext(root: HTMLElement, context: OrionPageContext): void {
	const stepEl = root.querySelector<HTMLElement>('[data-orion-step]');
	const titleEl = root.querySelector<HTMLElement>('[data-orion-title]');
	const goalEl = root.querySelector<HTMLElement>('[data-orion-goal]');
	if (stepEl) stepEl.textContent = context.step;
	if (titleEl) titleEl.textContent = context.title;
	if (goalEl) goalEl.textContent = context.goal;
}
