import type {
	OrionAssistantLabels,
	OrionMessage,
	OrionWorkflowDomain,
	OrionWorkflowProposal,
	OrionWorkflowSummary,
} from '../../../../core/types';

export type OrionStepController<
	TSummary extends OrionWorkflowSummary = OrionWorkflowSummary,
	TProposal extends OrionWorkflowProposal = OrionWorkflowProposal,
	TSummarizeContext = void,
	TApplyContext = void,
> = {
	domain: OrionWorkflowDomain;
	summarize: TSummarizeContext extends void
		? (message: string) => Promise<TSummary>
		: (message: string, context: TSummarizeContext) => Promise<TSummary>;
	merge: (existing: OrionWorkflowSummary | null, next: TSummary) => TSummary;
	createSummaryMessage: (summary: TSummary, labels: OrionAssistantLabels) => OrionMessage;
	createConfirmedMessage: (labels: OrionAssistantLabels) => OrionMessage;
	propose: (summary: TSummary) => Promise<TProposal>;
	createProposalMessage: (proposal: TProposal, labels: OrionAssistantLabels) => OrionMessage;
	apply: TApplyContext extends void
		? (proposal: TProposal) => Promise<void>
		: (context: TApplyContext, proposal: TProposal) => Promise<void>;
	createApplySuccessMessage: (labels: OrionAssistantLabels) => OrionMessage;
	createProposalErrorMessage: (labels: OrionAssistantLabels) => OrionMessage;
	createApplyErrorMessage: (labels: OrionAssistantLabels) => OrionMessage;
};
