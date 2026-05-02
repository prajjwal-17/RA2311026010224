"use client";

import { NotificationCard } from "@/components/NotificationCard";
import type { NotificationRecord } from "@/utils/notification-types";

type NotificationListSectionProps = {
  title: string;
  description: string;
  notifications: NotificationRecord[];
  readIds: string[];
  emptyMessage: string;
  onOpen: (id: string) => void;
};

export function NotificationListSection({
  title,
  description,
  notifications,
  readIds,
  emptyMessage,
  onOpen,
}: NotificationListSectionProps) {
  return (
    <section className="panel">
      <div className="panel__heading">
        <div>
          <p className="eyebrow">{title}</p>
          <h2>{title}</h2>
        </div>
        <div className="panel__meta">
          <p className="panel__description">{description}</p>
          <span className="panel__count">{notifications.length} items</span>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="notification-list">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isRead={readIds.includes(notification.id)}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </section>
  );
}
