import type { NotificationFilters, NotificationPagination } from "@/utils/notification-types";

export const DEFAULT_FILTERS: NotificationFilters = {
  notificationType: "All",
  priorityLimit: 10,
};

export const DEFAULT_PAGINATION: NotificationPagination = {
  limit: 5,
  page: 1,
  hasNextPage: false,
};

export const READ_STORAGE_KEY = "affordmed.notification.read.ids";
export const INTERNAL_LOG_ENDPOINT = "/api/log";
export const INTERNAL_NOTIFICATIONS_ENDPOINT = "/api/notifications";
