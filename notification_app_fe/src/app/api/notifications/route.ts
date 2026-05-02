import { NextResponse } from "next/server";
import { getServerAccessToken, getServerApiBaseUrl, serverLog } from "@/api/server";
import { normalizeNotificationResponse } from "@/utils/notification-mappers";

export async function GET(request: Request) {
  const accessToken = getServerAccessToken();

  if (!accessToken) {
    await serverLog("frontend", "error", "api", "Missing AFFORDMED_ACCESS_TOKEN");
    return NextResponse.json(
      { message: "Missing AFFORDMED_ACCESS_TOKEN configuration." },
      { status: 500 },
    );
  }

  const incomingUrl = new URL(request.url);
  const outgoingUrl = new URL(`${getServerApiBaseUrl()}/notifications`);

  for (const key of ["limit", "page", "notification_type"]) {
    const value = incomingUrl.searchParams.get(key);

    if (value) {
      outgoingUrl.searchParams.set(key, value);
    }
  }

  await serverLog("frontend", "info", "api", "Fetching notifications from upstream API");

  const response = await fetch(outgoingUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    await serverLog("frontend", "error", "api", "Upstream notifications request failed");
    return NextResponse.json(
      { message: "Unable to reach notifications service." },
      { status: response.status },
    );
  }

  const payload = normalizeNotificationResponse(await response.json());
  const requestedLimit = Number(incomingUrl.searchParams.get("limit") ?? payload.notifications.length);

  await serverLog("frontend", "debug", "api", "Normalized notifications payload");

  return NextResponse.json({
    notifications: payload.notifications,
    hasNextPage: payload.notifications.length === requestedLimit,
  });
}
