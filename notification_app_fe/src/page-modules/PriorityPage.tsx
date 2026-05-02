"use client";

import Link from "next/link";
import { NotificationListSection } from "@/components/NotificationListSection";
import { useNotificationsContext } from "@/state/notification-context";

export function PriorityPage() {
  const { state, actions } = useNotificationsContext();

  return (
    <main className="shell">
      <section className="hero hero--priority">
        <div className="hero__content">
          <p className="hero__eyebrow">Priority Inbox</p>
          <h1>Review the most important notifications in a calmer, focused view.</h1>
          <p className="hero__copy">
            The ranking stays driven by notification weight and recency, so placement
            updates naturally rise above older event traffic.
          </p>
        </div>
        <div className="hero__aside">
          <div className="hero-card">
            <p className="eyebrow">Current priority set</p>
            <h2>Top {state.filters.priorityLimit}</h2>
            <p>Filtered notifications stay in sync with the dashboard controls and read state.</p>
            <Link className="primary-link" href="/">
              Back to dashboard
            </Link>
          </div>
        </div>
      </section>

      <NotificationListSection
        title="Priority Notifications"
        description={`Showing top ${state.filters.priorityLimit} sorted with the heap-based selector.`}
        notifications={state.priorityNotifications}
        readIds={state.readIds}
        emptyMessage="No priority notifications are available for the current filter."
        onOpen={actions.markAsRead}
      />
    </main>
  );
}
