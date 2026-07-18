import type { AstroGlobal } from 'astro';

import { getSsrApiBaseUrl, forwardCookieHeaders } from '../../../../lib/ssr';
import { getAdminMe } from '../../../../lib/admin/auth';

import {
	getAdminPage,
	getAdminPages,
} from '../api';
import {
	getAdminPageTemplate,
	getAdminPageTemplates,
} from '../../templates/admin/api';
import type { CmsPage, CmsPageTemplateMetadata } from '../../core/types';



export async function requireAdminOrRedirect(Astro: AstroGlobal): Promise<Response | null> {
	try {
		await getAdminMe({ apiBaseUrl: getSsrApiBaseUrl(Astro), headers: forwardCookieHeaders(Astro) });
		return null;
	} catch (e) {
		const maybeStatus = e && typeof e === 'object' && 'status' in e ? (e as any).status : undefined;
		if (maybeStatus === 401 || maybeStatus === 403) {
			return Astro.redirect('/admin/auth');
		}
		throw e;
	}
}

export async function loadAdminPages(Astro: AstroGlobal): Promise<CmsPage[]> {
	const data = await getAdminPages({ apiBaseUrl: getSsrApiBaseUrl(Astro), headers: forwardCookieHeaders(Astro) });
	return Array.isArray(data) ? data : [];
}

export async function loadAdminPage(Astro: AstroGlobal, id: number): Promise<CmsPage> {
	return await getAdminPage(id, { apiBaseUrl: getSsrApiBaseUrl(Astro), headers: forwardCookieHeaders(Astro) });
}

export async function loadAdminPageTemplates(Astro: AstroGlobal): Promise<CmsPageTemplateMetadata[]> {
	const data = await getAdminPageTemplates({ apiBaseUrl: getSsrApiBaseUrl(Astro), headers: forwardCookieHeaders(Astro) });
	return Array.isArray(data) ? data : [];
}

export async function loadAdminPageTemplate(Astro: AstroGlobal, template: string): Promise<CmsPageTemplateMetadata> {
	return await getAdminPageTemplate(template, { apiBaseUrl: getSsrApiBaseUrl(Astro), headers: forwardCookieHeaders(Astro) });
}
