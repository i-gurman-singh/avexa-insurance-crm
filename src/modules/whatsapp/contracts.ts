export interface WhatsAppProvider {
  verifyWebhook(headers: Headers, rawBody: Uint8Array): Promise<boolean>;
  normalizeWebhook(rawBody: Uint8Array): Promise<NormalizedWhatsAppEvent[]>;
  sendText(input: { toE164: string; text: string; idempotencyKey: string }): Promise<{ providerMessageId: string }>;
  getProtectedMedia(providerMediaId: string): Promise<{ bytes: Uint8Array; contentType: string; fileName?: string }>;
}

export interface NormalizedWhatsAppEvent {
  providerEventId: string;
  providerMessageId: string;
  fromE164: string;
  occurredAt: Date;
  kind: "text" | "image" | "document" | "audio" | "status";
  text?: string;
  mediaId?: string;
  status?: "sent" | "delivered" | "read" | "failed";
  original: unknown;
}
