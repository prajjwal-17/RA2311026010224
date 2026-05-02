"use client";

import Link from "next/link";
import { NotificationListSection } from "@/components/NotificationListSection";
import { NotificationToolbar } from "@/components/NotificationToolbar";
import { StatusBanner } from "@/components/StatusBanner";
import { useNotificationsContext } from "@/state/notification-context";

export function DashboardPage() {
  const { state, actions } = useNotificationsContext();
  const unreadCount = state.allNotifications.filter(
    (notification) => !state.readIds.includes(notification.id),
  ).length;

  return (
    <main className="shell">
      <section className="hero hero--dashboard">
        <div className="hero__content">
          <p className="hero__eyebrow">Campus Notifications</p>
          <h1>Stay on top of placements, results, and events without losing context.</h1>
          <p className="hero__copy">
            A lightweight notification workspace with priority ranking, protected API
            access, and clean activity tracking built in.
          </p>
          <div className="hero__meta">
            <div className="stat-chip">
              <span className="stat-chip__value">{state.allNotifications.length}</span>
              <span className="stat-chip__label">Visible now</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__value">{state.priorityNotifications.length}</span>
              <span className="stat-chip__label">Priority queue</span>
            </div>
            <div className="stat-chip">
              <span className="stat-chip__value">{unreadCount}</span>
              <span className="stat-chip__label">Unread</span>
            </div>
          </div>
        </div>
        <div className="hero__aside">
          <div className="hero-card">
            <p className="eyebrow">Focus Mode</p>
            <h2>Priority inbox</h2>
            <p>Move into a cleaner review flow when you only want the highest-signal updates.</p>
            <Link className="primary-link" href="/priority">
              Open priority inbox
            </Link>
          </div>
        </div>
      </section>

      <NotificationToolbar
        filters={state.filters}
        pagination={state.pagination}
        onLimitChange={actions.setLimit}
        onPriorityLimitChange={actions.setPriorityLimit}
        onTypeChange={actions.setNotificationType}
      />

      {state.error ? (
        <StatusBanner tone="error" message={state.error} />
      ) : null}

      {state.isLoading ? (
        <StatusBanner tone="info" message="Refreshing notifications from the test server..." />
      ) : null}

      <div className="content-grid">
        <NotificationListSection
          title="All Notifications"
          description={`Page ${state.pagination.page} with ${state.pagination.limit} items per request.`}
          notifications={state.allNotifications}
          readIds={state.readIds}
          emptyMessage="No notifications match the current filters."
          onOpen={actions.markAsRead}
        />

        <NotificationListSection
          title="Priority Notifications"
          description={`Top ${state.filters.priorityLimit} notifications ranked by type and recency.`}
          notifications={state.priorityNotifications}
          readIds={state.readIds}
          emptyMessage="Priority notifications will appear here once the API returns data."
          onOpen={actions.markAsRead}
        />
      </div>

      <section className="pagination-card pagination-card--wide">
        <div>
          <p className="eyebrow">Pagination</p>
          <h2>Navigate the notification feed</h2>
        </div>
        <div className="pagination-actions">
          <button
            className="secondary-button"
            type="button"
            disabled={state.pagination.page === 1}
            onClick={() => actions.goToPage(state.pagination.page - 1)}
          >
            Previous
          </button>
          <span className="page-indicator">Page {state.pagination.page}</span>
          <button
            className="secondary-button"
            type="button"
            disabled={!state.pagination.hasNextPage}
            onClick={() => actions.goToPage(state.pagination.page + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </main>
  );
}
