export const defaultPipelineStages = [
  { id: "new_lead", label: "New Lead" },
  { id: "quote_requested", label: "Quote Requested" },
  { id: "quoting", label: "Quoting" },
  { id: "quote_provided", label: "Quote Provided" },
  { id: "follow_up", label: "Follow Up" },
  { id: "interested", label: "Interested" },
  { id: "ready_to_bind", label: "Ready to Bind" },
  { id: "documents_requested", label: "Documents Requested" },
  { id: "documents_received", label: "Documents Received" },
  { id: "binding", label: "Binding" },
  { id: "policy_completed", label: "Policy Completed" },
  { id: "lost", label: "Lost" },
  { id: "future_follow_up", label: "Future Follow Up" },
] as const;

export type PipelineStageId = (typeof defaultPipelineStages)[number]["id"];

const labelsByPipelineStage = Object.fromEntries(
  defaultPipelineStages.map((pipelineStage) => [pipelineStage.id, pipelineStage.label]),
) as Record<PipelineStageId, string>;

export function pipelineStageLabel(pipelineStage: PipelineStageId): string {
  return labelsByPipelineStage[pipelineStage];
}
