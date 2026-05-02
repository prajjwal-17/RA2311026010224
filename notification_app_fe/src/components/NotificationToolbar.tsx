"use client";

import { NOTIFICATION_TYPES } from "@/utils/notification-types";
import type { NotificationFilters, NotificationPagination } from "@/utils/notification-types";

type NotificationToolbarProps = {
  filters: NotificationFilters;
  pagination: NotificationPagination;
  onLimitChange: (value: number) => void;
  onPriorityLimitChange: (value: number) => void;
  onTypeChange: (value: NotificationFilters["notificationType"]) => void;
};

export function NotificationToolbar({
  filters,
  pagination,
  onLimitChange,
  onPriorityLimitChange,
  onTypeChange,
}: NotificationToolbarProps) {
  return (
    <section className="toolbar-card">
      <div className="toolbar-card__header">
        <div>
          <p className="eyebrow">Controls</p>
          <h2>Refine the feed</h2>
        </div>
        <p className="toolbar-card__copy">
          Adjust the visible feed and the separate priority ranking without leaving the page.
        </p>
      </div>
      <div className="toolbar-grid">
        <label className="field">
          <span className="field__label">Notification Type</span>
          <select
            value={filters.notificationType}
            onChange={(event) =>
              onTypeChange(event.target.value as NotificationFilters["notificationType"])
            }
          >
            {NOTIFICATION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Items Per Page</span>
          <select
            value={pagination.limit}
            onChange={(event) => onLimitChange(Number(event.target.value))}
          >
            {[5, 10, 15].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>

        <label className="field">
          <span className="field__label">Priority Top N</span>
          <select
            value={filters.priorityLimit}
            onChange={(event) => onPriorityLimitChange(Number(event.target.value))}
          >
            {[5, 10, 15, 20].map((limit) => (
              <option key={limit} value={limit}>
                {limit}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
