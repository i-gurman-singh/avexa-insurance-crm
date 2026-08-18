export type ClientDocumentCategory =
  | "drivers-license"
  | "vehicle-ownership"
  | "void-cheque"
  | "winter-tires"
  | "applications"
  | "policies";

export interface PrivateDocumentStorage {
  put(input: { key: string; bytes: Uint8Array; contentType: string; metadata: Record<string, string> }): Promise<void>;
  createReadUrl(input: { key: string; expiresInSeconds: number; disposition?: "inline" | "attachment" }): Promise<string>;
  deleteVersion(input: { key: string; versionId?: string }): Promise<void>;
}

export function clientDocumentPrefix(clientId: string, category: ClientDocumentCategory): string {
  if (!/^[a-zA-Z0-9_-]+$/.test(clientId)) throw new Error("clientId must be a generated identifier");
  return `clients/${clientId}/${category}/`;
}
