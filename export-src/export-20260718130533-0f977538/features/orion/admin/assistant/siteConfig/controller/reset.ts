import type { DomainResetContext } from '../../shared/types/domainController';
import { createSiteConfigResetMessage } from '../messages/bootstrap';
import { focusSiteConfigCard } from './focus';

export function resetSiteConfigAssistantState({ pathname, labels, state }: DomainResetContext): boolean {
	state.messagesByPath[pathname] = [createSiteConfigResetMessage(labels)];
	focusSiteConfigCard('branding');
	return true;
}
