# Cowrite Client

The frontend application for Cowrite, a modern real-time collaborative text editor. Built with React, Vite, and Tiptap.

## Features

- **Rich Text Editor:** A powerful editor based on [Tiptap](https://tiptap.dev/).
- **Real-time Collaboration:** See changes from other users instantly.
- **Modern UI:** Clean and responsive interface built with Tailwind CSS and Framer Motion.
- **Document Management:** Create, view, and manage your documents.

## Tech Stack

- **Framework:** React
- **Build Tool:** Vite
- **Editor Framework:** Tiptap
- **State Management/CRDT:** Yjs
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Routing:** React Router DOM
- **Testing:** Vitest & React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Cowrite Server running locally (usually on port 3000)

### Installation

1.  Navigate to the client directory:

    ```bash
    cd cowrite-client
    ```

2.  Install dependencies:

    ```bash
    npm install
    ```

3.  Set up environment variables:
    Create a `.env` file in the root directory (optional if defaults work, but good practice):
    ```env
    VITE_API_URL=http://localhost:3000
    VITE_WS_URL=ws://localhost:3000
    ```

### Running the Application

- **Development Mode:**

  ```bash
  npm run dev
  ```

  Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

- **Build for Production:**

  ```bash
  npm run build
  ```

- **Preview Production Build:**
  ```bash
  npm run preview
  ```

### Testing

Run the test suite:

```bash
npm test
```

## Project Structure

- `src/components/editor`: Tiptap editor components and toolbar configuration.
- `src/pages`: Main application pages (Dashboard, Login, Editor).
- `src/context`: React context providers (AuthContext).
- `src/api`: Axios configuration for API requests.
