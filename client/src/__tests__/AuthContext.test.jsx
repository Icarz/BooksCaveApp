import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { AuthProvider, useAuth } from "../AuthContext";

const TestComponent = () => {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? "logged-in" : "logged-out"}</span>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts unauthenticated when no token is in localStorage", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
  });

  it("starts authenticated when a token exists in localStorage", () => {
    localStorage.setItem("token", "some-valid-token");
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
  });

  it("sets isAuthenticated to true after calling login()", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText("Login").click();
    });
    expect(screen.getByTestId("status")).toHaveTextContent("logged-in");
  });

  it("sets isAuthenticated to false and removes token after calling logout()", async () => {
    localStorage.setItem("token", "some-valid-token");
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    await act(async () => {
      screen.getByText("Logout").click();
    });
    expect(screen.getByTestId("status")).toHaveTextContent("logged-out");
    expect(localStorage.getItem("token")).toBeNull();
  });
});
