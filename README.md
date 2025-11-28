# 💻 Cowrite: Client Application (MVP)

## 🌟 Introduction

This repository contains the **Cowrite Client Application**, the frontend interface for the collaborative Markdown editor. It is built as a single-page application (SPA) responsible for authentication, real-time editing, and displaying the user interface.

## 🛠️ Tech Stack

| Component       | Technology                | Role                                                                   |
| :-------------- | :------------------------ | :--------------------------------------------------------------------- |
| **Framework**   | **React (Vite)**          | Fast development environment and component-based UI.                   |
| **Language**    | **TypeScript**            | Ensures type safety for component props, state, and API communication. |
| **Editor Core** | **Tiptap/ProseMirror**    | Headless, extensible editor framework for rich text input.             |
| **Real-Time**   | **Yjs** / **y-websocket** | Client-side handling of Conflict-free Replicated Data Types (CRDTs).   |
| **Routing**     | **React Router DOM**      | Handles client-side navigation (`/login`, `/dashboard`, `/doc/:id`).   |
| **API Comm.**   | **Axios**                 | Authenticated HTTP client for REST API calls to `cowrite-server`.      |

---

## 🚀 Getting Started

### Prerequisites

You must have the **`cowrite-server`** running on a separate terminal window, typically at `http://localhost:8080` (or similar).

### Setup & Run

1.  **Clone:** `git clone <client-repo-url> cowrite-client`
2.  **Navigate:** `cd cowrite-client`
3.  **Install Dependencies:** `npm install`
4.  **Run Dev Server:** `npm run dev` (The app will typically run on `http://localhost:5173`).

---

## 🔑 MVP Authentication & API Integration

### 1. Context & Security

The client manages session state via a **JWT** stored in `localStorage` and accessed via an **`AuthContext`**. All API calls to the backend are handled through an **Axios interceptor** that automatically attaches the JWT for authentication.

### 2. Core Routes

| Route        | Status  | Description                                                                             | Required Auth |
| :----------- | :------ | :-------------------------------------------------------------------------------------- | :------------ |
| `/login`     | Phase 2 | Handles user login. Sends credentials to `POST /api/auth/login`.                        | No            |
| `/register`  | Phase 2 | Handles user registration. Sends credentials to `POST /api/auth/register`.              | No            |
| `/dashboard` | Phase 2 | Lists user's documents and handles creation. Fetches data from `GET /api/documents`.    | Yes           |
| `/doc/:id`   | Phase 3 | The main editor view. Fetches initial content and establishes **WebSocket** connection. | Yes           |

---

## 📝 Document Editor Flow (Phase 2 & 3)

The document flow is broken down into two main parts:

### Phase 2: Static Editor

1.  User navigates to `/doc/:id`.
2.  App fetches the document details and the initial **`yjs_state_blob`** from the REST API.
3.  The **Tiptap** editor initializes with the content loaded from the server.

### Phase 3: Real-Time Collaboration

1.  The `DocumentEditor` component establishes a **WebSocket** connection to `ws://server/doc/:id`.
2.  The connection uses the **`y-websocket`** provider to link the local **Yjs Document (CRDT)** to the server's master state.
3.  The Tiptap editor is bound to the Yjs document, enabling **instantaneous, conflict-free synchronization** across all connected users.
