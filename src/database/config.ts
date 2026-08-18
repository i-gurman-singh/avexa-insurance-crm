import { environmentVariables, requireServerEnvironment } from "@/src/shared/config/environment";

export const postgresDefaults = {
  host: "127.0.0.1",
  port: 5432,
  database: "avexa_crm",
  user: "avexa_crm_user",
} as const;

export function getDatabaseUrl(): string {
  return requireServerEnvironment(environmentVariables.databaseUrl);
}
