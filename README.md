# CM Chat App

A responsive chat application UI built with **React 18 + TypeScript + Vite + Tailwind CSS + React Router**, matching the CM Chat App Figma design (chat list, chat window, call logs, groups, settings with privacy sub-pages, profile, and a Keyboard Shortcuts modal that supports both Windows and macOS key labels).

## Tech stack
- React 18 + TypeScript
- Vite (build tool / dev server)
- Tailwind CSS (utility styling, light/dark theme via `class` strategy)
- React Router v6 (client-side routing, incl. nested routes for Settings → Privacy)
- lucide-react (icons)

## Run it locally

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview   # optional local preview of the production build
```

## Project structure

```
src/
  components/     Shared UI: IconRail, ChatWindow, ChatListPanel, ContactInfoPanel,
                  modals (StartNewConversation, CreateGroup, KeyboardShortcuts),
                  Avatar, Toggle, RadioGroup, EmptyState, SettingsDetail
  pages/          Route-level screens: ChatsPage, CallsPage, GroupsPage, ProfilePage,
                  SettingsLayout, and pages/settings/* for each settings sub-screen
  context/        ThemeContext (light/dark mode, persisted to localStorage)
  hooks/          useOS (detects Windows vs macOS for keyboard shortcut labels)
  data/           Mock contacts / chats / messages / call log (swap for a real API)
  types/          Shared TypeScript interfaces
```

## Routes

| Path | Screen |
|---|---|
| `/` | Chats (empty state until a chat is selected) |
| `/chat/:chatId` | Chat window with a selected conversation |
| `/calls` | Call log + active call panel |
| `/groups` | Groups list + create group |
| `/profile` | Your profile (name, about, avatar) |
| `/settings` | Settings home |
| `/settings/notifications` | Notification toggles |
| `/settings/privacy` | Privacy menu |
| `/settings/privacy/last-seen` | Last seen visibility |
| `/settings/privacy/profile-photo` | Profile photo visibility |
| `/settings/privacy/about` | About visibility |
| `/settings/privacy/groups` | Who can add you to groups |
| `/settings/privacy/blocked-contacts` | Blocked contacts list |
| `/settings/security` | Two-step verification, login alerts, read receipts |
| `/settings/theme` | Light / dark theme picker |
| `/settings/wallpaper` | Chat background picker |
| `/settings/request-access` | Request account info |
| `/settings/keyboard-shortcuts` | Full shortcut list |
| `/settings/help` | FAQ |

## Responsiveness

- **Mobile (`< md`)**: single-column navigation — chat list, call list, groups list, and settings list each take the full screen; opening an item pushes to a detail view with a back button.
- **Tablet/Desktop (`≥ md` / `≥ lg`)**: multi-column layout — icon rail + list panel + detail panel, with the contact-info/media/starred side panel appearing at `lg` and above.

## Keyboard Shortcuts (Windows + macOS)

The Keyboard Shortcuts modal (`src/components/KeyboardShortcutsModal.tsx`) auto-detects the visitor's OS (`src/hooks/useOS.ts`) and also lets them manually toggle between **macOS** (`Cmd`) and **Windows** (`Ctrl`) key labels — both sets are fully defined, not just relabeled.

## Deploying

This repo cannot be deployed for you automatically from this chat session (no outbound network access here), but it's a completely standard Vite app — either of these takes about 2 minutes:

### Option A — Netlify (drag & drop, no CLI needed)
1. Run `npm install && npm run build` locally. This creates a `dist/` folder.
2. Go to https://app.netlify.com/drop and drag the `dist/` folder into the browser window.
3. Netlify gives you a live URL immediately. (The included `netlify.toml` / `public/_redirects` already handle client-side routing so refreshing `/settings/privacy` etc. won't 404.)

### Option B — Netlify CLI
```bash
npm install -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

### Option C — Vercel CLI
```bash
npm install -g vercel
vercel --prod
```
(The included `vercel.json` handles the SPA rewrite.)

### Option D — GitHub + Netlify/Vercel auto-deploy
1. Push this folder to a new GitHub repo.
2. On Netlify or Vercel, "Import Project" → pick the repo.
3. Build command: `npm run build`, output directory: `dist`. Deploy.

## Data layer: json-server

Data (contacts, chats, messages, call log, status updates) now lives in **`db.json`** at the project root and is loaded over HTTP through a small API client (`src/api/client.ts`), instead of being hardcoded in the bundle.

### Local development — real json-server, real persistence

```bash
npm run server   # starts json-server on http://localhost:3001, watching db.json
npm run dev      # in a second terminal — starts the app as usual
```

While `npm run dev` is running, the app automatically points at `http://localhost:3001`. Every read and write (sending a message, deleting a chat, blocking a contact, etc.) really persists to `db.json` on disk — open the file after using the app and you'll see it update.

### Production (Netlify) — an important constraint

**Plain `json-server` cannot run on Netlify.** Netlify only hosts static files (plus optional short-lived serverless functions) — it can't keep a long-running Node process like json-server alive. This isn't specific to this project; no static host (Netlify, Vercel, GitHub Pages) can run json-server directly.

The fix used here: **[my-json-server.typicode.com](https://my-json-server.typicode.com)**, a free service (made by the same author as json-server) that serves any GitHub repo's `db.json` as a live, json-server-compatible REST API — no server to deploy or manage. Once `db.json` is pushed to `github.com/Saikiran1603/CM-Chat-App`, the API is instantly live at:

```
https://my-json-server.typicode.com/Saikiran1603/CM-Chat-App/contacts
https://my-json-server.typicode.com/Saikiran1603/CM-Chat-App/chats
https://my-json-server.typicode.com/Saikiran1603/CM-Chat-App/messages
...etc
```

The app's API client automatically uses this URL for production builds — nothing to configure on Netlify's side.

**One limitation to know and be upfront about:** my-json-server's writes (POST/PATCH/DELETE) are *faked* — they respond successfully so the UI updates immediately, but nothing is actually saved on their server, so a page refresh reverts to the original `db.json` content. This is a limitation of the free hosted service, not a bug in this app. The app is built to handle this gracefully: every action updates local state immediately (so it always feels instant and "just works" in a demo), and best-effort mirrors the change to the API in the background.

If real write persistence in production is needed, point `VITE_API_URL` (set as an environment variable in Netlify's dashboard, or in a local `.env` file — see `.env.example`) at a self-hosted json-server instead, e.g. one deployed to Render or Railway's free tier, which *can* keep a Node process running.

### Resilience

If the API is unreachable for any reason (offline, `npm run server` not started locally, my-json-server briefly rate-limited), every screen falls back to the bundled mock data in `src/data/mockData.ts` instead of showing a blank page.


- Data is currently mocked in `src/data/mockData.ts` — wire up a real backend/WebSocket by replacing that file's exports with API calls.
- Colors/spacing live in `tailwind.config.js` under the `accent`, `rail`, `panel`, `appbg`, `muted`, `border`, `bubbleIn`, `bubbleOut` keys if you need to fine-tune the palette to match the Figma file more exactly.
