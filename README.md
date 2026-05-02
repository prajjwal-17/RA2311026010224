# Campus Notifications Evaluation Submission

This repository contains my frontend-track submission for the campus hiring evaluation. The project implements:

- a reusable logging middleware package
- a heap-based Stage 1 notification prioritization solution
- a full Next.js frontend for Stage 2
- responsive dashboard views for all notifications and priority notifications
- protected API access through server-side route handlers

## Deliverables

The repository is organized around the required frontend-track deliverables:

- [logging_middleware](./logging_middleware)
- [notification_system_design.md](./notification_system_design.md)
- [notification_app_fe](./notification_app_fe)
- [output_images](./output_images)

## What The App Does

The application solves two parts of the problem:

### Stage 1

The Stage 1 requirement is implemented through a heap-based prioritization module in:

- [notification_app_fe/src/utils/notification-heap.ts](./notification_app_fe/src/utils/notification-heap.ts)

It returns the top `N` notifications by:

1. type priority: `Placement > Result > Event`
2. recency within the same priority

Instead of sorting the entire dataset every time, the solution maintains a bounded min heap and achieves:

- time complexity: `O(n log k)`
- space complexity: `O(k)`

Detailed design notes are documented in:

- [notification_system_design.md](./notification_system_design.md)

### Stage 2

The frontend is built with Next.js and provides:

- all notifications view
- priority notifications view
- filtering by notification type
- pagination support
- read vs unread tracking
- centralized logging for API calls, UI interactions, and state changes

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Vanilla CSS
- Next.js Route Handlers for secure API proxying
- Browser local storage for read-state persistence

## Folder Structure

```text
AffordTest/
  notification_app_fe/
    src/
      api/
      app/
      components/
      hooks/
      middleware/
      page-modules/
      pages/
      state/
      utils/
  logging_middleware/
  notification_system_design.md
  output_images/
```

## Authentication Approach

The frontend track explicitly assumes users are already authorized and should not see a registration or login UI.

To satisfy that while still consuming the protected evaluation APIs:

1. a bearer token is generated externally through the evaluation `register` and `auth` endpoints
2. that token is stored locally in `notification_app_fe/.env.local`
3. the browser never calls the evaluation server directly
4. Next.js route handlers attach the bearer token server-side

This keeps credentials out of the client bundle while preserving the expected frontend-only user experience.

## Logging Middleware

The shared logging package lives in:

- [logging_middleware/index.js](./logging_middleware/index.js)
- [logging_middleware/index.d.ts](./logging_middleware/index.d.ts)

It exposes a reusable function that conforms to the evaluation requirement:

```ts
log(stack, level, package, message)
```

In this project, logging is used across:

- upstream API requests
- route-handler errors
- client state updates
- user interactions such as filter and pagination changes

## System Architecture

```mermaid
flowchart TB
    user[Candidate / Reviewer]

    subgraph client[Client Layer]
        ui[Dashboard UI<br/>Priority Inbox]
        state[Notifications Context<br/>Hooks + Reducer]
        storage[Local Storage<br/>Read / Unread IDs]
    end

    subgraph app[Application Layer]
        proxy[Next.js Route Handlers<br/>/api/notifications<br/>/api/log]
        heap[Priority Engine<br/>Min Heap Top N]
        logger[Logging Middleware]
        mapper[Notification Normalizer]
    end

    subgraph external[External Services]
        notif[Notifications API]
        logs[Logs API]
    end

    user --> ui
    ui --> state
    state <--> storage
    state --> heap
    state --> proxy
    proxy --> mapper
    mapper --> notif
    proxy --> logger
    logger --> logs
    heap --> ui
```

## Request Flow

At runtime, the flow is:

1. the user opens the dashboard in the browser
2. the client state layer requests notifications through `/api/notifications`
3. the Next.js route handler adds the bearer token from `.env.local`
4. the protected evaluation notifications API returns the raw payload
5. notifications are normalized and passed to the UI
6. the heap-based priority selector computes the top `N`
7. all important events are logged using the protected logs API through the shared logging middleware

## Key Implementation Files

### Frontend

- [notification_app_fe/src/app/page.tsx](./notification_app_fe/src/app/page.tsx)
- [notification_app_fe/src/app/priority/page.tsx](./notification_app_fe/src/app/priority/page.tsx)
- [notification_app_fe/src/page-modules/DashboardPage.tsx](./notification_app_fe/src/page-modules/DashboardPage.tsx)
- [notification_app_fe/src/page-modules/PriorityPage.tsx](./notification_app_fe/src/page-modules/PriorityPage.tsx)
- [notification_app_fe/src/components/NotificationToolbar.tsx](./notification_app_fe/src/components/NotificationToolbar.tsx)
- [notification_app_fe/src/components/NotificationListSection.tsx](./notification_app_fe/src/components/NotificationListSection.tsx)
- [notification_app_fe/src/components/NotificationCard.tsx](./notification_app_fe/src/components/NotificationCard.tsx)

### Data And State

- [notification_app_fe/src/hooks/useNotificationsController.ts](./notification_app_fe/src/hooks/useNotificationsController.ts)
- [notification_app_fe/src/state/notification-context.tsx](./notification_app_fe/src/state/notification-context.tsx)
- [notification_app_fe/src/state/notification-reducer.ts](./notification_app_fe/src/state/notification-reducer.ts)
- [notification_app_fe/src/utils/notification-types.ts](./notification_app_fe/src/utils/notification-types.ts)
- [notification_app_fe/src/utils/notification-mappers.ts](./notification_app_fe/src/utils/notification-mappers.ts)
- [notification_app_fe/src/utils/read-storage.ts](./notification_app_fe/src/utils/read-storage.ts)

### Server Proxy And Logging

- [notification_app_fe/src/app/api/notifications/route.ts](./notification_app_fe/src/app/api/notifications/route.ts)
- [notification_app_fe/src/app/api/log/route.ts](./notification_app_fe/src/app/api/log/route.ts)
- [notification_app_fe/src/api/server.ts](./notification_app_fe/src/api/server.ts)
- [notification_app_fe/src/middleware/logger.ts](./notification_app_fe/src/middleware/logger.ts)
- [logging_middleware/index.js](./logging_middleware/index.js)

## Running The Project

Create:

- `notification_app_fe/.env.local`

with:

```env
AFFORDMED_API_BASE_URL=http://20.207.122.201/evaluation-service
AFFORDMED_ACCESS_TOKEN=your_access_token_here
```

Then run:

```bash
cd notification_app_fe
npm install
npm run dev
```

Open:

- `http://localhost:3000`

## Verification

The project was verified with:

```bash
npm run lint
npm run build
```

run inside the `frontend` directory.
run inside the `notification_app_fe` directory.

## UI Screenshots

### Desktop Views

![Desktop view 1](./output_images/img1_pc.png)
![Desktop view 2](./output_images/img2_pc.png)
![Desktop view 3](./output_images/img3_pc.png)
![Desktop view 4](./output_images/img4_pc.png)

### Mobile Views

![Mobile view 1](./output_images/img1_mobile.png)
![Mobile view 2](./output_images/img2_mobile.png)
![Mobile view 3](./output_images/img3_mobile.png)
![Mobile view 4](./output_images/img4_mobile.png)

### Additional Screen

![Additional view](./output_images/img5.png)

## Notes

- the frontend does not expose registration or login UI because the frontend track assumes pre-authorized access
- the bearer token is kept in `.env.local` and not committed
- the route-handler layer exists only to protect the token and keep the browser-side app compliant with the evaluation constraints
