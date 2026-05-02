# Stage 1 - Notification System Design

## Objective

Return the top `N` notifications by ranking:

1. `Placement`
2. `Result`
3. `Event`

If two notifications have the same type priority, the more recent timestamp wins.

## Approach

The implementation lives in `frontend/src/utils/notification-heap.ts` and exposes:

- `getTopNotifications(notifications, limit)`

The function scans the incoming notification list once and maintains a fixed-size min heap.

## Sorting logic

Each notification is scored using:

- `Placement = 3`
- `Result = 2`
- `Event = 1`
- `timestamp = Date.parse(notification.timestamp)`

The heap stores the current top `N` candidates. The root of the heap is always the weakest notification among the current winners:

- lower type priority is weaker
- if type priority ties, older timestamp is weaker

When a new notification arrives:

1. If the heap has fewer than `N` elements, insert it.
2. Otherwise compare it with the heap root.
3. If the new notification is stronger, replace the root and heapify.

After the scan completes, the heap contents are converted to an array and sorted for final display in descending order:

- higher priority first
- more recent first

## Heap-based optimization

Using a full sort would cost `O(n log n)`.

Using a bounded min heap of size `N` reduces the work to:

- heap insertion or replacement: `O(log N)`
- repeated over `n` notifications
- total: `O(n log N)`

This is especially useful when:

- the notification stream is large
- the UI only needs a small priority inbox such as top 5, 10, or 20

## Time and space complexity

- Time: `O(n log N)`
- Space: `O(N)`

## Handling new incoming notifications efficiently

The same heap strategy works for streaming updates:

1. Keep the heap in memory.
2. For every new notification, compare it against the heap root.
3. Insert or replace only when it improves the top `N`.
4. Re-sort only the final heap view when the UI needs a stable ranked output.

This keeps updates cheap and avoids re-sorting the entire dataset whenever a new notification is received.
