import { handleHeaderNavSaveCompletion } from '../../headerNav/controller/completion';
import { handleSiteConfigSaveCompletion } from '../../siteConfig/controller/completion';
import { handleSiteProfileSaveCompletion } from '../../siteProfile/controller/completion';
import type { AssistantControllerStore } from './state';

export function handleSaveCompletions(
	store: AssistantControllerStore,
	searchParams: URLSearchParams,
): void {
	if (handleSiteProfileSaveCompletion(store, searchParams)) return;
	if (handleSiteConfigSaveCompletion(store, searchParams)) return;
	handleHeaderNavSaveCompletion(store, searchParams);
}
