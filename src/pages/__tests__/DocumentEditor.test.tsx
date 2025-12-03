import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import DocumentEditor from "../DocumentEditor";
import api from "../../api/axios";

import { AuthContext, type AuthContextType } from "../../context/AuthContext";

vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

const authValue: AuthContextType = {
  user: { id: "1", email: "user@example.com", name: "Test User" },
  token: "token",
  isAuthenticated: true,
  login: vi.fn(),
  register: vi.fn(),
  logout: vi.fn(),
};

vi.mock("@tiptap/react", () => ({
  EditorContent: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="editor-content">{children}</div>
  ),
  useEditor: vi.fn(() => ({
    commands: {
      setContent: vi.fn(),
      focus: vi.fn(),
      updateUser: vi.fn(),
    },
    setEditable: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
    getHTML: vi.fn(() => "<p>content</p>"),
    isActive: vi.fn(() => false),
    getAttributes: vi.fn(() => ({})),
    chain: vi.fn(() => ({
      focus: vi.fn().mockReturnThis(),
      setImage: vi.fn().mockReturnThis(),
      extendMarkRange: vi.fn().mockReturnThis(),
      unsetLink: vi.fn().mockReturnThis(),
      setLink: vi.fn().mockReturnThis(),
      undo: vi.fn().mockReturnThis(),
      redo: vi.fn().mockReturnThis(),
      toggleHeading: vi.fn().mockReturnThis(),
      toggleBold: vi.fn().mockReturnThis(),
      toggleItalic: vi.fn().mockReturnThis(),
      toggleUnderline: vi.fn().mockReturnThis(),
      toggleStrike: vi.fn().mockReturnThis(),
      toggleCode: vi.fn().mockReturnThis(),
      toggleBlockquote: vi.fn().mockReturnThis(),
      toggleBulletList: vi.fn().mockReturnThis(),
      toggleOrderedList: vi.fn().mockReturnThis(),
      toggleTaskList: vi.fn().mockReturnThis(),
      sinkListItem: vi.fn().mockReturnThis(),
      liftListItem: vi.fn().mockReturnThis(),
      setTextAlign: vi.fn().mockReturnThis(),
      unsetAllMarks: vi.fn().mockReturnThis(),
      run: vi.fn(),
    })),
  })),
}));

describe("DocumentEditor", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRoute = (id: string) => {
    return render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[`/doc/${id}`]}>
          <Routes>
            <Route path="/doc/:id" element={<DocumentEditor />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>
    );
  };

  it("shows loading state initially", () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );

    renderWithRoute("1");

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("shows error message when fetch fails", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network")
    );

    renderWithRoute("1");

    await waitFor(() => {
      expect(screen.getByText(/failed to load document/i)).toBeInTheDocument();
    });
  });

  it("shows 'Document not found' when no document returned", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: null,
    });

    renderWithRoute("1");

    await waitFor(() => {
      expect(screen.getByText(/document not found/i)).toBeInTheDocument();
    });
  });

  it("saves title on change after debounce", async () => {
    const putSpy = (
      api.put as unknown as ReturnType<typeof vi.fn>
    ).mockResolvedValue({});
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { id: "1", title: "Old title", currentUserPermission: "owner" },
    });

    renderWithRoute("1");

    const input = await screen.findByDisplayValue("Old title");
    fireEvent.change(input, { target: { value: "New title" } });

    await waitFor(
      () => {
        expect(putSpy).toHaveBeenCalledWith("/api/documents/1", {
          title: "New title",
        });
      },
      { timeout: 2000 }
    );
  });
});
