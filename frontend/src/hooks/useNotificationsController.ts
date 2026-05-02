"use client";

import {
  startTransition,
  useEffect,
  useEffectEvent,
  useReducer,
} from "react";
import { fetchNotifications } from "@/api/client";
import { log } from "@/middleware/logger";
import {
  initialNotificationState,
  notificationReducer,
} from "@/state/notification-reducer";
import { persistReadIds, loadReadIds } from "@/utils/read-storage";
import type { NotificationType } from "@/utils/notification-types";

export function useNotificationsController() {
  const [state, dispatch] = useReducer(
    notificationReducer,
    initialNotificationState,
  );

  const loadNotifications = useEffectEvent(async () => {
    dispatch({ type: "LOAD_STARTED" });
    await log("frontend", "info", "hook", "Started notification refresh");

    try {
      const [allResult, priorityResult] = await Promise.all([
        fetchNotifications({
          limit: state.pagination.limit,
          page: state.pagination.page,
          notificationType: state.filters.notificationType,
        }),
        fetchNotifications({
          fetchAll: true,
          notificationType: state.filters.notificationType,
        }),
      ]);

      const { getTopNotifications } = await import("@/utils/notification-heap");

      dispatch({
        type: "LOAD_SUCCEEDED",
        payload: {
          allNotifications: allResult.notifications,
          priorityNotifications: getTopNotifications(
            priorityResult.notifications,
            state.filters.priorityLimit,
          ),
          hasNextPage: allResult.hasNextPage,
        },
      });

      await log("frontend", "debug", "state", "Updated notifications state");
    } catch (error) {
      dispatch({
        type: "LOAD_FAILED",
        payload:
          error instanceof Error
            ? error.message
            : "Something went wrong while loading notifications.",
      });

      await log("frontend", "error", "hook", "Failed to refresh notifications");
    }
  });

  useEffect(() => {
    void loadNotifications();
  }, [state.filters, state.pagination.limit, state.pagination.page]);

  useEffect(() => {
    const ids = loadReadIds();
    dispatch({ type: "HYDRATE_READ_IDS", payload: ids });
    void log("frontend", "debug", "state", "Hydrated read notification IDs");
  }, []);

  useEffect(() => {
    persistReadIds(state.readIds);
  }, [state.readIds]);

  const setNotificationType = (value: NotificationType | "All") => {
    startTransition(() => {
      dispatch({ type: "SET_FILTER", payload: value });
    });
    void log("frontend", "info", "component", "User changed notification type filter");
  };

  const setPriorityLimit = (value: number) => {
    startTransition(() => {
      dispatch({ type: "SET_PRIORITY_LIMIT", payload: value });
    });
    void log("frontend", "info", "component", "User changed priority limit");
  };

  const setLimit = (value: number) => {
    startTransition(() => {
      dispatch({ type: "SET_LIMIT", payload: value });
    });
    void log("frontend", "info", "component", "User changed page size");
  };

  const goToPage = (value: number) => {
    startTransition(() => {
      dispatch({ type: "SET_PAGE", payload: value });
    });
    void log("frontend", "info", "component", "User changed page");
  };

  const markAsRead = (id: string) => {
    dispatch({ type: "MARK_AS_READ", payload: id });
    void log("frontend", "debug", "state", "Marked a notification as read");
  };

  return {
    state,
    actions: {
      goToPage,
      markAsRead,
      setLimit,
      setNotificationType,
      setPriorityLimit,
    },
  };
}
