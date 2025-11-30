import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../Dashboard";
import api from "../../api/axios";
import { AuthContext, type AuthContextType } from "../../context/AuthContext";

vi.mock("../../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const authValue: AuthContextType = {
    user: { id: "1", email: "user@example.com", name: "Test User" },
    token: "token",
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  const renderDashboard = (initialEntries: string[] = ["/dashboard"]) =>
    render(
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={initialEntries}>
          <Dashboard />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  it("shows loading state initially", () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise(() => {})
    );

    renderDashboard(["/dashboard"]);

    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it("renders documents after successful fetch", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [
        { id: "1", title: "Doc 1" },
        { id: "2", title: "Doc 2" },
      ],
    });

    renderDashboard(["/dashboard"]);

    await waitFor(() => {
      expect(screen.getByText("Doc 1")).toBeInTheDocument();
      expect(screen.getByText("Doc 2")).toBeInTheDocument();
    });
  });

  it("shows error when fetching documents fails", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockRejectedValue(
      new Error("Network")
    );

    renderDashboard(["/dashboard"]);

    await waitFor(() => {
      expect(screen.getByText(/failed to load documents/i)).toBeInTheDocument();
    });
  });

  it("creates a new document and navigates", async () => {
    (api.get as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: [],
    });

    (api.post as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      data: { id: "123", title: "Untitled Document" },
    });

    renderDashboard(["/dashboard"]);

    await waitFor(() => {
      expect(screen.getByText(/your documents/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /new document/i }));

    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith("/api/documents", {
        title: "Untitled Document",
      });
    });
  });
});
