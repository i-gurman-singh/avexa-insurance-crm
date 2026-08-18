// Compatibility exports for existing integrations. New code imports from src/ module boundaries.
export type { NormalizedWhatsAppEvent, WhatsAppProvider } from "../../src/modules/whatsapp/contracts";
export type { MessageIntent, MessageUnderstandingProvider } from "../../src/modules/ai/messages/contracts";
export type { DocumentUnderstandingProvider } from "../../src/modules/ai/documents/contracts";
export type { PrivateDocumentStorage } from "../../src/modules/documents/contracts";
export type { AuditWriter, BackgroundQueue } from "../../src/shared/integrations/contracts";
