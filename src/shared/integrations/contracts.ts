export interface BackgroundQueue {
  publish<T extends Record<string, unknown>>(input: { type: string; payload: T; idempotencyKey: string; delaySeconds?: number }): Promise<void>;
}

export interface AuditWriter {
  append(input: { actorId?: string; action: string; entityType: string; entityId: string; correlationId: string; summary: Record<string, unknown> }): Promise<void>;
}
