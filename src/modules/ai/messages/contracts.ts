import type { PipelineStageId } from "@/src/shared/pipeline-stages";

export type MessageIntent =
  | "quote_request"
  | "providing_information"
  | "price_objection"
  | "ready_to_bind"
  | "document_submission"
  | "question"
  | "follow_up_request"
  | "not_interested"
  | "purchased_elsewhere"
  | "needs_assistance"
  | "unknown";

export interface MessageUnderstandingProvider {
  analyze(input: { text?: string; recentContext: Array<{ direction: "in" | "out"; text: string }>; schemaVersion: string }): Promise<{
    intent: MessageIntent;
    confidence: number;
    facts: Record<string, unknown>;
    suggestedPipelineStage?: PipelineStageId;
    suggestedTasks: Array<{ type: string; reason: string; dueInMinutes?: number }>;
    suggestedReply?: string;
    requiresHumanReview: boolean;
    model: string;
  }>;
}
