"use client";

import type { EvaluationLevel, EvaluationPackage } from "@logging-middleware";
import { INTERNAL_LOG_ENDPOINT, INTERNAL_NOTIFICATIONS_ENDPOINT } from "@/utils/constants";
import type {
  NotificationFetchResult,
  NotificationType,
} from "@/utils/notification-types";

export async function sendClientLog(
  level: EvaluationLevel,
  packageName: EvaluationPackage,
  message: string,
): Promise<void> {
  try {
    await fetch(INTERNAL_LOG_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        stack: "frontend",
        level,
        package: packageName,
        message,
      }),
    });
  } catch {
    return;
  }
}

export async function fetchNotifications(params: {
  limit?: number;
  page?: number;
  notificationType?: NotificationType | "All";
  fetchAll?: boolean;
}): Promise<NotificationFetchResult> {
  const query = new URLSearchParams();

  if (!params.fetchAll) {
    if (params.limit) {
      query.set("limit", String(params.limit));
    }

    if (params.page) {
      query.set("page", String(params.page));
    }
  }

  if (params.notificationType && params.notificationType !== "All") {
    query.set("notification_type", params.notificationType);
  }

  await sendClientLog("info", "api", "Requesting notifications from internal API");

  const response = await fetch(`${INTERNAL_NOTIFICATIONS_ENDPOINT}?${query.toString()}`, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    await sendClientLog("error", "api", "Notifications API responded with an error");
    throw new Error("Unable to fetch notifications.");
  }

  const payload = (await response.json()) as NotificationFetchResult;

  await sendClientLog("debug", "api", "Notifications payload received successfully");

  return payload;
}
