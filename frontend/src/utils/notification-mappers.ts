import type {
  NotificationApiResponse,
  NotificationRecord,
  NotificationType,
} from "@/utils/notification-types";

type UnknownNotification = {
  id?: unknown;
  ID?: unknown;
  type?: unknown;
  Type?: unknown;
  message?: unknown;
  Message?: unknown;
  timestamp?: unknown;
  Timestamp?: unknown;
};

function isNotificationType(value: unknown): value is NotificationType {
  return value === "Event" || value === "Result" || value === "Placement";
}

export function normalizeNotification(input: UnknownNotification): NotificationRecord | null {
  const id = input.id ?? input.ID;
  const type = input.type ?? input.Type;
  const message = input.message ?? input.Message;
  const timestamp = input.timestamp ?? input.Timestamp;

  if (
    typeof id !== "string" ||
    !isNotificationType(type) ||
    typeof message !== "string" ||
    typeof timestamp !== "string"
  ) {
    return null;
  }

  return {
    id,
    type,
    message,
    timestamp,
  };
}

export function normalizeNotificationResponse(payload: unknown): NotificationApiResponse {
  if (!payload || typeof payload !== "object" || !("notifications" in payload)) {
    return { notifications: [] };
  }

  const notifications = Array.isArray(payload.notifications)
    ? payload.notifications
        .map((item) => normalizeNotification(item as UnknownNotification))
        .filter((item): item is NotificationRecord => item !== null)
    : [];

  return { notifications };
}
