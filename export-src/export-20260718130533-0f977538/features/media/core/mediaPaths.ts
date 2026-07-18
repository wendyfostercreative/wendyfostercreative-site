type MediaPublicPathItem = {
	collection?: string | null;
	category?: string | null;
	slug?: string | null;
};

function safeSegment(value: string): string {
	return encodeURIComponent(value.trim());
}

export function mediaPublicHref(item: MediaPublicPathItem, options: { fallback?: string } = {}): string {
	const fallback = typeof options.fallback === 'string' ? options.fallback : '#';

	const slug = item?.slug ? String(item.slug) : '';
	const collection = item?.collection ? String(item.collection) : '';
	const category = item?.category ? String(item.category) : '';

	if (collection && category && slug) {
		return `/${safeSegment(collection)}/${safeSegment(category)}/${safeSegment(slug)}`;
	}

	return fallback;
}
