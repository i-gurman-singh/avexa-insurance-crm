import { environmentVariables, requireServerEnvironment } from "@/src/shared/config/environment";

export const whatsappWebhookRoute = "/api/whatsapp/webhook";
export const productionWhatsAppWebhookUrl = `https://crm.avexainsurance.ca${whatsappWebhookRoute}`;

export function getWhatsAppProviderConfig() {
  return {
    provider: "360dialog" as const,
    apiKey: requireServerEnvironment(environmentVariables.d360ApiKey),
  };
}
