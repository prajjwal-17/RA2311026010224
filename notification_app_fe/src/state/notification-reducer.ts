import { DEFAULT_FILTERS, DEFAULT_PAGINATION } from "@/utils/constants";
import type { NotificationState, NotificationAction } from "@/state/notification-types";

export const initialNotificationState: NotificationState = {
  allNotifications: [],
  priorityNotifications: [],
  filters: DEFAULT_FILTERS,
  pagination: DEFAULT_PAGINATION,
  readIds: [],
  isLoading: false,
  error: null,
  lastUpdatedAt: null,
};

export function notificationReducer(
  state: NotificationState,
  action: NotificationAction,
): NotificationState {
  switch (action.type) {
    case "LOAD_STARTED":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOAD_SUCCEEDED":
      return {
        ...state,
        isLoading: false,
        error: null,
        allNotifications: action.payload.allNotifications,
        priorityNotifications: action.payload.priorityNotifications,
        pagination: {
          ...state.pagination,
          hasNextPage: action.payload.hasNextPage,
        },
        lastUpdatedAt: new Date().toISOString(),
      };
    case "LOAD_FAILED":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    case "SET_FILTER":
      return {
        ...state,
        filters: {
          ...state.filters,
          notificationType: action.payload,
        },
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };
    case "SET_PRIORITY_LIMIT":
      return {
        ...state,
        filters: {
          ...state.filters,
          priorityLimit: action.payload,
        },
      };
    case "SET_PAGE":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          page: action.payload,
        },
      };
    case "SET_LIMIT":
      return {
        ...state,
        pagination: {
          ...state.pagination,
          limit: action.payload,
          page: 1,
        },
      };
    case "MARK_AS_READ":
      if (state.readIds.includes(action.payload)) {
        return state;
      }

      return {
        ...state,
        readIds: [...state.readIds, action.payload],
      };
    case "HYDRATE_READ_IDS":
      return {
        ...state,
        readIds: action.payload,
      };
    default:
      return state;
  }
}
