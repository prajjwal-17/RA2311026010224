export type NotificationType = "Event" | "Result" | "Placement";

export type NotificationRecord = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
};

export type NotificationFilters = {
  notificationType: NotificationType | "All";
  priorityLimit: number;
};

export type NotificationPagination = {
  limit: number;
  page: number;
  hasNextPage: boolean;
};

export type NotificationApiResponse = {
  notifications: NotificationRecord[];
};

export type NotificationFetchResult = {
  notifications: NotificationRecord[];
  hasNextPage: boolean;
};

export const NOTIFICATION_PRIORITY: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export const NOTIFICATION_TYPES: Array<NotificationType | "All"> = [
  "All",
  "Placement",
  "Result",
  "Event",
];
