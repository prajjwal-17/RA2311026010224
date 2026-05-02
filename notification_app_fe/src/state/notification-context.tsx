"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useNotificationsController } from "@/hooks/useNotificationsController";

type NotificationsContextValue = ReturnType<typeof useNotificationsController>;

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const value = useNotificationsController();

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext(): NotificationsContextValue {
  const context = useContext(NotificationsContext);

  if (!context) {
    throw new Error("useNotificationsContext must be used inside NotificationsProvider.");
  }

  return context;
}
