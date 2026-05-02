# Campus Notifications Frontend

This Next.js application implements the frontend stage of the campus hiring evaluation:

- secure notification fetching through local API routes
- centralized protected-route logging
- heap-based priority notification selection
- filtering, pagination, and read/unread tracking

## Environment setup

Create `frontend/.env.local` from `.env.example` and set:

- `AFFORDMED_API_BASE_URL`
- `AFFORDMED_ACCESS_TOKEN`

The frontend track assumes pre-authorized access, so the UI does not expose a login or registration screen. The protected upstream API is called only from Next.js route handlers to avoid exposing the bearer token in the browser.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Project structure

```text
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
```

The shared logging package is located in `../logging_middleware`.

## Architecture

Use the following Mermaid source to generate the architecture image for submission:

```mermaid
flowchart LR
    U[User Browser] --> UI[Next.js App Router UI\nDashboard + Priority Inbox]
    UI --> HC[Notifications Context + Hook Controller]
    HC --> CA[Client API Helpers]
    HC --> LS[Local Storage\nRead / Unread State]

    CA --> AN[/GET /api/notifications/]
    CA --> AL[/POST /api/log/]

    AN --> SA[Server API Layer]
    AL --> LM[Shared Logging Middleware]

    SA --> UP[Affordmed Notifications API]
    SA --> NM[Notification Normalizer]
    NM --> HP[Heap-based Priority Engine\nTop N by weight + recency]

    LM --> LOG[Affordmed Logs API]

    HP --> UI
    LS --> UI
```

Architecture image placeholder:

![Project architecture placeholder](../output_images/architecture-placeholder.png)

## Screenshots

Desktop dashboard:

![Desktop dashboard 1](../output_images/img1_pc.png)
![Desktop dashboard 2](../output_images/img2_pc.png)
![Desktop dashboard 3](../output_images/img3_pc.png)
![Desktop dashboard 4](../output_images/img4_pc.png)

Mobile dashboard:

![Mobile dashboard 1](../output_images/img1_mobile.png)
![Mobile dashboard 2](../output_images/img2_mobile.png)
![Mobile dashboard 3](../output_images/img3_mobile.png)
![Mobile dashboard 4](../output_images/img4_mobile.png)

Priority inbox / additional view:

![Priority view](../output_images/img5.png)
