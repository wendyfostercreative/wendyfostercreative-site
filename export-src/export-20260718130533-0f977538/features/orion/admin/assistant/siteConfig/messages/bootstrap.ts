import type { OrionLabels, OrionMessage } from '../../../../core/types';
import { getSiteConfigCardByKey } from '../../../../core/workflow/siteConfig';
import { cardEntryText } from '../workflow';

export function createSiteConfigTransitionMessage(labels: OrionLabels): OrionMessage {
	return {
		role: 'assistant',
		text: `${labels.siteConfigStep}: ${labels.siteConfigTitle}

${labels.siteConfigTransition}

${labels.siteConfigPrompt}`,
	};
}

export function createSiteConfigResetMessage(labels: OrionLabels): OrionMessage {
	const brandingCard = getSiteConfigCardByKey('branding');
	return {
		role: 'assistant',
		text:
			brandingCard
				? cardEntryText(brandingCard.cardKey, labels)
				: labels.siteConfigEntryBranding,
		replaceKey: 'site-config-card-entry',
	};
}
