import type {
	OrionAssistantLabels,
	OrionAssistantState,
	OrionLabels,
	OrionMessage,
	OrionPageContext,
} from '../../../core/types';
import {
	createAdminHomeSeedMessage,
	shouldReseedAdminHomeMessages,
} from '../adminHome/workflow';
import { createHeaderNavSeedMessage } from '../headerNav/messages/bootstrap';
import { createSiteProfileSeedMessage } from '../siteProfile/messages/bootstrap';

type AssistantMessageState = Pick<OrionAssistantState, 'messagesByPath'>;

export function createSeedMessage(
	context: OrionPageContext,
	labels: OrionAssistantLabels,
): OrionMessage {
	if (context.key === 'admin_home') {
		return createAdminHomeSeedMessage(context, labels);
	}

	if (context.key === 'site_profile') {
		return createSiteProfileSeedMessage(context, labels);
	}

	if (context.key === 'header_nav') {
		return createHeaderNavSeedMessage(context, labels);
	}

	return {
		role: 'assistant',
		text: `${context.step}: ${context.title}

${context.prompt}`,
	};
}

export function createSiteTransitionMessage(labels: OrionLabels): OrionMessage {
	return {
		role: 'assistant',
		text: `${labels.siteConfigStep}: ${labels.siteConfigTitle}

${labels.siteConfigTransition}

${labels.siteConfigPrompt}`,
	};
}

export function messagesForPath(
	state: AssistantMessageState,
	pathname: string,
	context: OrionPageContext,
	labels: OrionAssistantLabels,
): OrionMessage[] {
	const existing = state.messagesByPath[pathname];
	if (existing?.length) {
		if (context.key === 'admin_home' && shouldReseedAdminHomeMessages(existing)) {
			const seeded = [createSeedMessage(context, labels)];
			state.messagesByPath[pathname] = seeded;
			return seeded;
		}
		if (existing.length === 1 && existing[0]?.role === 'assistant' && !existing[0]?.actions?.length) {
			const seeded = [createSeedMessage(context, labels)];
			state.messagesByPath[pathname] = seeded;
			return seeded;
		}
		return existing;
	}
	const seeded = [createSeedMessage(context, labels)];
	state.messagesByPath[pathname] = seeded;
	return seeded;
}

export function appendMessageForPath(
	state: AssistantMessageState,
	pathname: string,
	context: OrionPageContext,
	labels: OrionAssistantLabels,
	message: OrionMessage,
): void {
	const next = messagesForPath(state, pathname, context, labels);
	next.push(message);
	state.messagesByPath[pathname] = next;
}

export function upsertMessageAtPath(
	state: AssistantMessageState,
	pathname: string,
	message: OrionMessage,
): void {
	const existing = state.messagesByPath[pathname] ?? [];
	if (message.replaceKey) {
		const index = existing.findIndex((entry) => entry.replaceKey === message.replaceKey);
		if (index >= 0) {
			existing[index] = message;
			state.messagesByPath[pathname] = existing;
			return;
		}
	}
	existing.push(message);
	state.messagesByPath[pathname] = existing;
}

export function removeMessageByReplaceKey(
	state: AssistantMessageState,
	pathname: string,
	replaceKey: string,
): void {
	const existing = state.messagesByPath[pathname] ?? [];
	state.messagesByPath[pathname] = existing.filter((entry) => entry.replaceKey !== replaceKey);
}

export function removeMessagesAtPath(
	state: AssistantMessageState,
	pathname: string,
	predicate: (message: OrionMessage) => boolean,
): void {
	const existing = state.messagesByPath[pathname] ?? [];
	state.messagesByPath[pathname] = existing.filter((entry) => !predicate(entry));
}

export function replaceLastMessageAtPath(
	state: AssistantMessageState,
	pathname: string,
	predicate: (message: OrionMessage) => boolean,
	replacement: OrionMessage,
): void {
	const existing = state.messagesByPath[pathname] ?? [];
	for (let index = existing.length - 1; index >= 0; index -= 1) {
		if (!predicate(existing[index])) continue;
		existing[index] = replacement;
		state.messagesByPath[pathname] = existing;
		return;
	}
	existing.push(replacement);
	state.messagesByPath[pathname] = existing;
}

export function resetMessagesForPath(
	state: AssistantMessageState,
	pathname: string,
	context: OrionPageContext,
	labels: OrionAssistantLabels,
): void {
	state.messagesByPath[pathname] = [createSeedMessage(context, labels)];
}
