export type ApiError = Error & {
	status?: number;
	detail?: unknown;
	code?: string;
};

export type ApiFetchOptions = RequestInit & {
	apiBaseUrl?: string;
	parseAs?: "json" | "text" | "none";
};

export type BaseOptions = {
	apiBaseUrl?: string;
	headers?: HeadersInit;
};

export type ApiResponse<T> = {
	ok: boolean;
	data: T | null;
	meta?: {
		resource?: string;
		action?: string;
		count?: number | null;
	} | null;
	error?: {
		code?: string;
		message?: string;
	} | null;
};

export type ApiListData<T> = {
	items: T[];
};

export type PageData<T> = {
	page: T;
};

export type MediaData<T> = {
	media: T;
};

export type MediaDeleteData<T> = {
	deleted: boolean;
	soft_deleted?: boolean;
	file_key: string;
	media?: T | null;
};

export type TemplateData<T> = {
	template: T;
};
