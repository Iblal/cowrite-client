import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../Login";
import { AuthProvider, AuthContext, useAuth } from "../../context/AuthContext";

const renderLogin = () => {
  return render(
    <AuthProvider>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthProvider>
  );
};

describe("Login page", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("renders form fields and submit button", () => {
    renderLogin();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows error message when login fails", async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error("Invalid"));

    const MockAuthProvider = ({ children }: { children: React.ReactNode }) => (
      <AuthProvider>
        <AuthContextOverride login={mockLogin}>{children}</AuthContextOverride>
      </AuthProvider>
    );

    const AuthContextOverride = ({
      children,
      login,
    }: {
      children: React.ReactNode;
      login: (email: string, password: string) => Promise<void>;
    }) => {
      const auth = useAuth();
      return (
        <AuthContext.Provider value={{ ...auth, login }}>
          {children}
        </AuthContext.Provider>
      );
    };

    render(
      <MockAuthProvider>
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      </MockAuthProvider>
    );

    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/failed to login. please check your credentials./i)
      ).toBeInTheDocument();
    });
  });
});
