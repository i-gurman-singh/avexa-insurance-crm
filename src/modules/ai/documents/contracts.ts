export interface DocumentUnderstandingProvider {
  extract(input: { bytes: Uint8Array; contentType: string; permittedTypes: string[]; schemaVersion: string }): Promise<{
    predictedType: string;
    typeConfidence: number;
    fields: Array<{ key: string; value: string; confidence: number }>;
    requiresHumanReview: boolean;
    model: string;
  }>;
}
