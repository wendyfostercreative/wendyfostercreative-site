import type { AstroGlobal } from 'astro';

import { forwardCookieHeaders, getSsrApiBaseUrl } from '../../../../lib/ssr';
import { getAdminImage, getAdminImages } from './api';
import type { AdminMediaImageItem, AdminMediaImagesResponse } from '../../core/types';

export async function loadAdminImages(
	Astro: AstroGlobal,
	input: { media_role?: string } = {},
): Promise<AdminMediaImagesResponse> {
	const data = await getAdminImages({
		media_role: input.media_role,
		apiBaseUrl: getSsrApiBaseUrl(Astro),
		headers: forwardCookieHeaders(Astro),
	});

	return Array.isArray(data) ? data : [];
}

export async function loadAdminImage(
	Astro: AstroGlobal,
	fileBase: string,
): Promise<AdminMediaImageItem> {
	return await getAdminImage(fileBase, {
		apiBaseUrl: getSsrApiBaseUrl(Astro),
		headers: forwardCookieHeaders(Astro),
	});
}
