import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../ProtectedRoute";
import { AuthProvider } from "../../context/AuthContext";

const renderWithRouter = (initialEntries: string[]) => {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<div>Dashboard Content</div>} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("ProtectedRoute", () => {
  it("redirects unauthenticated users to /login", () => {
    // ensure no auth token is present
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    renderWithRouter(["/dashboard"]);

    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders child route when authenticated", () => {
    localStorage.setItem("token", "fake-token");
    localStorage.setItem(
      "user",
      JSON.stringify({ id: "1", email: "test@example.com" })
    );

    renderWithRouter(["/dashboard"]);

    expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
  });
});
