import type {
  NotificationFilters,
  NotificationPagination,
  NotificationRecord,
} from "@/utils/notification-types";

export type NotificationState = {
  allNotifications: NotificationRecord[];
  priorityNotifications: NotificationRecord[];
  filters: NotificationFilters;
  pagination: NotificationPagination;
  readIds: string[];
  isLoading: boolean;
  error: string | null;
  lastUpdatedAt: string | null;
};

export type NotificationAction =
  | { type: "LOAD_STARTED" }
  | {
      type: "LOAD_SUCCEEDED";
      payload: {
        allNotifications: NotificationRecord[];
        priorityNotifications: NotificationRecord[];
        hasNextPage: boolean;
      };
    }
  | { type: "LOAD_FAILED"; payload: string }
  | { type: "SET_FILTER"; payload: NotificationFilters["notificationType"] }
  | { type: "SET_PRIORITY_LIMIT"; payload: number }
  | { type: "SET_PAGE"; payload: number }
  | { type: "SET_LIMIT"; payload: number }
  | { type: "MARK_AS_READ"; payload: string }
  | { type: "HYDRATE_READ_IDS"; payload: string[] };
