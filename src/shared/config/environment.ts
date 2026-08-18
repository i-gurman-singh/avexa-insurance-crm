export const environmentVariables = {
  nodeEnvironment: "NODE_ENV",
  appUrl: "APP_URL",
  databaseUrl: "DATABASE_URL",
  sessionSecret: "SESSION_SECRET",
  fieldEncryptionKey: "FIELD_ENCRYPTION_KEY",
  awsRegion: "AWS_REGION",
  s3BucketName: "S3_BUCKET_NAME",
  awsAccessKeyId: "AWS_ACCESS_KEY_ID",
  awsSecretAccessKey: "AWS_SECRET_ACCESS_KEY",
  sqsAnalysisQueueUrl: "AWS_SQS_ANALYSIS_QUEUE_URL",
  sqsAnalysisDeadLetterQueueUrl: "AWS_SQS_ANALYSIS_DLQ_URL",
  d360ApiKey: "D360_API_KEY",
  openAiApiKey: "OPENAI_API_KEY",
  openAiMessageModel: "OPENAI_MESSAGE_MODEL",
  openAiDocumentModel: "OPENAI_DOCUMENT_MODEL",
} as const;

export type EnvironmentVariableName = (typeof environmentVariables)[keyof typeof environmentVariables];

export function requireServerEnvironment(name: EnvironmentVariableName): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing required server environment variable: ${name}`);
  return value;
}
