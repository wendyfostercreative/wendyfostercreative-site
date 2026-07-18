import { apiFetch } from '../../../lib/api';
import type { BaseOptions } from '../../../lib/types';

export type ExportIssue = {
	code: string;
	severity: 'warning' | 'error';
	message: string;
	location?: string | null;
	details?: Record<string, unknown>;
};

export type MissingMediaFile = {
	url: string;
	source: string;
	resolved_path?: string | null;
};

export type ExportPreflightSummary = {
	published_page_count: number;
	published_media_count: number;
	missing_media_count: number;
	unsupported_template_count: number;
	route_issue_count: number;
	estimated_media_bytes: number;
};

export type ExportPreflightResult = {
	ready: boolean;
	summary: ExportPreflightSummary;
	warnings: ExportIssue[];
	errors: ExportIssue[];
	missing_media: MissingMediaFile[];
};

export type ExportRun = {
	id: string;
	created_at: string;
	status: string;
	stage: string;
	warnings: ExportIssue[];
	errors: ExportIssue[];
	output_path?: string | null;
};

export type ExportStatus = {
	phase: string;
	build_available: boolean;
	github_available: boolean;
	preflight: ExportPreflightResult;
	latest_run?: ExportRun | null;
};

export async function getAdminExportStatus(options: BaseOptions = {}): Promise<ExportStatus> {
	return await apiFetch<ExportStatus>('/admin/v1/export/status', {
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
}

export async function runAdminExportPreflight(options: BaseOptions = {}): Promise<ExportPreflightResult> {
	return await apiFetch<ExportPreflightResult>('/admin/v1/export/preflight', {
		method: 'POST',
		apiBaseUrl: options.apiBaseUrl,
		headers: options.headers,
	});
}

export async function createAdminExportBuild(options: BaseOptions = {}): Promise<ExportRun> {
	const data = await apiFetch<{ run?: ExportRun }>('/admin/v1/export/build', {
		method: 'POST',
		apiBaseUrl: options.apiBaseUrl,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
		body: JSON.stringify({}),
	});
	if (!data.run) throw new Error('Export run was not returned.');
	return data.run;
}
