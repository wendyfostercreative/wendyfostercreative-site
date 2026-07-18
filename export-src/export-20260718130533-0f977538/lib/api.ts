import type { ApiError, ApiFetchOptions, ApiResponse } from './types';

export function normalizeApiBase(apiBase: string): string {
	const trimmed = String(apiBase || '').trim();
	if (!trimmed) return '';
	if (trimmed.startsWith('/')) return trimmed;

	const base = trimmed.endsWith('/') ? trimmed : `${trimmed}/`;
	if (base.endsWith('/api/') || base.endsWith('/api')) return base;
	try {
		return new URL('api/', base).toString();
	} catch {
		return '';
	}
}

export function resolveApiBaseUrl(explicit: string | undefined): string {
	if (explicit) return explicit;

	if (import.meta.env.SSR) {
		const fromRuntime =
			(typeof process !== 'undefined' && process.env && (process.env.API_BASE_URL || process.env.API_PROXY_TARGET))
				? (process.env.API_BASE_URL || process.env.API_PROXY_TARGET)
				: undefined;

		if (typeof fromRuntime === 'string' && fromRuntime.trim()) {
			const normalized = normalizeApiBase(fromRuntime);
			if (normalized) return normalized;
		}
	}

	const fromPublic = import.meta.env.PUBLIC_API_BASE_URL;
	if (!fromPublic) return "/api";
	return fromPublic;
}

function joinUrl(base: string, path: string): string {
	const b = base.endsWith("/") ? base : `${base}/`;
	const p = path.startsWith("/") ? path.slice(1) : path;
	return `${b}${p}`;
}

async function parseErrorDetail(res: Response): Promise<unknown> {
	const contentType = res.headers.get("content-type") || "";

	try {
		if (contentType.includes("application/json")) return await res.json();
		return await res.text();
	} catch {
		return undefined;
	}
}

function isApiResponse(value: unknown): value is ApiResponse<unknown> {
	return Boolean(value && typeof value === 'object' && 'ok' in value && typeof (value as { ok?: unknown }).ok === 'boolean');
}

function apiErrorFromEnvelope(body: ApiResponse<unknown>, status?: number): ApiError {
	const message = body.error?.message || body.error?.code || `Request failed${status ? ` (${status})` : ''}`;
	const err: ApiError = new Error(message);
	err.status = status;
	err.detail = body;
	err.code = body.error?.code;
	return err;
}

export function unwrapApiResponse<T = unknown>(body: unknown, status?: number): T {
	if (!isApiResponse(body)) return body as T;
	if (body.ok) return body.data as T;
	throw apiErrorFromEnvelope(body, status);
}

export async function apiFetch<T = unknown>(
	path: string,
	options: ApiFetchOptions = {},
): Promise<T> {
	const apiBaseUrl = resolveApiBaseUrl(options.apiBaseUrl);
	const url = joinUrl(apiBaseUrl, path);

	const res = await fetch(url, {
		...options,
		credentials: options.credentials ?? "include",
		body: options.body ?? undefined,
	});

	if (!res.ok) {
		const detail = await parseErrorDetail(res);
		if (isApiResponse(detail)) throw apiErrorFromEnvelope(detail, res.status);

		console.error('[apiFetch failed]', {
			url,
			status: res.status,
			statusText: res.statusText,
			detail,
		});
		const err: ApiError = new Error(`Request failed (${res.status})`);
		err.status = res.status;
		err.detail = detail;
		throw err;
	}

	const parseAs = options.parseAs ?? "json";
	if (parseAs === "none") return undefined as T;
	if (parseAs === "text") return (await res.text()) as T;
	return unwrapApiResponse<T>(await res.json(), res.status);
}
