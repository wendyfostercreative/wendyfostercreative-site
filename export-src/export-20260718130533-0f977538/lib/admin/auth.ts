import { apiFetch } from '../api';
import type { AdminMe, AdminLoginResponse, AdminLogoutResponse } from './type'


export function redirectToAdminAuth(): void {
	window.location.href = '/admin/auth';
}

export async function getAdminMe(
	options: { apiBaseUrl?: string; headers?: HeadersInit } = {},
): Promise<AdminMe> {
	const data = await apiFetch<{ user: AdminMe }>('/admin/v1/auth/me', {
		apiBaseUrl: options.apiBaseUrl,
		method: 'GET',
		headers: options.headers,
		parseAs: 'json',
	});
	return data.user;
}

export async function adminLogin(
	payload: { username: string; password: string },
	options: { apiBaseUrl?: string } = {},
): Promise<AdminLoginResponse> {
	return await apiFetch<AdminLoginResponse>('/admin/v1/auth/login', {
		apiBaseUrl: options.apiBaseUrl,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(payload),
		parseAs: 'json',
	});
}

export async function adminLogout(options: { apiBaseUrl?: string } = {}): Promise<void> {
	const data = await apiFetch<AdminLogoutResponse>('/admin/v1/auth/logout', {
		apiBaseUrl: options.apiBaseUrl,
		method: 'POST',
		parseAs: 'json',
	});
	if (!data.logged_out) throw new Error('Logout did not complete.');
}

export async function requireAdminSession(options: { apiBaseUrl?: string } = {}): Promise<boolean> {
	try {
		await getAdminMe({ apiBaseUrl: options.apiBaseUrl });
		return true;
	} catch (e) {
		const maybeStatus = e && typeof e === 'object' && 'status' in e ? (e as any).status : undefined;
		if (maybeStatus === 401 || maybeStatus === 403 || maybeStatus === undefined) {
			redirectToAdminAuth();
			return false;
		}
		throw e;
	}
}
