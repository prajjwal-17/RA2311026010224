import { createEvaluationLogger } from "@logging-middleware";

const apiBaseUrl =
  process.env.AFFORDMED_API_BASE_URL ?? "http://20.207.122.201/evaluation-service";

function getAccessToken(): string | null {
  return process.env.AFFORDMED_ACCESS_TOKEN ?? null;
}

export const serverLog = createEvaluationLogger({
  endpoint: `${apiBaseUrl}/logs`,
  getAccessToken,
});

export function getServerApiBaseUrl(): string {
  return apiBaseUrl;
}

export function getServerAccessToken(): string | null {
  return getAccessToken();
}
