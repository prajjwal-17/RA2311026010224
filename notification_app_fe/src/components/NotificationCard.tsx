"use client";

import { formatNotificationTime } from "@/utils/date";
import type { NotificationRecord } from "@/utils/notification-types";

type NotificationCardProps = {
  notification: NotificationRecord;
  isRead: boolean;
  onOpen: (id: string) => void;
};

export function NotificationCard({
  notification,
  isRead,
  onOpen,
}: NotificationCardProps) {
  return (
    <article
      className={`notification-card ${isRead ? "notification-card--read" : "notification-card--unread"}`}
    >
      <div className="notification-card__header">
        <div className="notification-card__header-main">
          <span className={`pill pill--${notification.type.toLowerCase()}`}>
            {notification.type}
          </span>
          <span
            className={`notification-card__status ${isRead ? "notification-card__status--read" : "notification-card__status--unread"}`}
          >
            {isRead ? "Read" : "Unread"}
          </span>
        </div>
        <span className="notification-card__time">
          {formatNotificationTime(notification.timestamp)}
        </span>
      </div>

      <p className="notification-card__message">{notification.message}</p>

      <button
        className="ghost-button"
        type="button"
        onClick={() => onOpen(notification.id)}
      >
        {isRead ? "Viewed" : "Mark as read"}
      </button>
    </article>
  );
}
