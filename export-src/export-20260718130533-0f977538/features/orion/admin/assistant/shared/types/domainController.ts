import type {
	OrionAssistantLabels,
	OrionMessage,
	OrionMessageAction,
	OrionPageContext,
	OrionWorkflowDomain,
	OrionWorkflowState,
} from '../../../../core/types';

export type WorkflowSetter = (workflow: OrionWorkflowState) => void;
export type MessageAppender = (message: OrionMessage) => void;
export type AssistantPathState = {
	messagesByPath: Record<string, OrionMessage[]>;
	workflowsByPath: Record<string, OrionWorkflowState>;
};

export type DomainActionContext = {
	action: OrionMessageAction['id'];
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	pathname: string;
	setWorkflow: WorkflowSetter;
	appendMessage: MessageAppender;
	state: AssistantPathState;
	updateVisibleWorkflowContext: () => void;
};

export type DomainSubmitContext = {
	text: string;
	workflow: OrionWorkflowState;
	labels: OrionAssistantLabels;
	pathname: string;
	setWorkflow: WorkflowSetter;
	appendMessage: MessageAppender;
};

export type DomainTextIntentContext = DomainSubmitContext & {
	state: AssistantPathState;
	updateVisibleWorkflowContext: () => void;
};

export type DomainResetContext = {
	pathname: string;
	context: OrionPageContext;
	labels: OrionAssistantLabels;
	state: AssistantPathState;
};

export type DomainControllerAdapter = {
	handleAction: (context: DomainActionContext) => Promise<boolean>;
	handleSubmit: (context: DomainSubmitContext) => Promise<boolean>;
	handleTextIntent?: (context: DomainTextIntentContext) => Promise<boolean>;
	resetState?: (context: DomainResetContext) => boolean;
};

export type SupportedWorkflowDomain = OrionWorkflowDomain;
