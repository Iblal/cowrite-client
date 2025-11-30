import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import { AuthContext, type AuthContextType } from "../../context/AuthContext";
import DashboardHeader from "../DashboardHeader";

const renderWithAuth = (override: Partial<AuthContextType> = {}) => {
  const defaultValue: AuthContextType = {
    user: { id: "1", email: "user@example.com", name: "Test User" },
    token: "token",
    isAuthenticated: true,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  };

  const value = { ...defaultValue, ...override } as AuthContextType;

  return render(
    <BrowserRouter>
      <AuthContext.Provider value={value}>
        <DashboardHeader />
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

describe("DashboardHeader", () => {
  it("shows user name when available", () => {
    renderWithAuth({
      user: { id: "1", email: "user@example.com", name: "Alice" },
    });

    expect(screen.getByText(/hello, alice/i)).toBeInTheDocument();
  });

  it("falls back to email when name missing", () => {
    renderWithAuth({ user: { id: "1", email: "user@example.com" } });

    expect(screen.getByText(/hello, user@example.com/i)).toBeInTheDocument();
  });

  it("calls logout when logout button clicked", () => {
    const logout = vi.fn();
    renderWithAuth({ logout });

    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    expect(logout).toHaveBeenCalledTimes(1);
  });
});
