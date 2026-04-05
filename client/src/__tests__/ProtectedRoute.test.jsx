import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, beforeEach } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";

const ProtectedPage = () => <div>Protected Content</div>;
const AuthPage = () => <div>Auth Page</div>;

const renderWithRouter = (initialPath) =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/saved"
          element={
            <ProtectedRoute>
              <ProtectedPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );

describe("ProtectedRoute", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("redirects to /auth when no token is present", () => {
    renderWithRouter("/saved");
    expect(screen.getByText("Auth Page")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });

  it("renders children when a token is present", () => {
    localStorage.setItem("token", "valid-token");
    renderWithRouter("/saved");
    expect(screen.getByText("Protected Content")).toBeInTheDocument();
    expect(screen.queryByText("Auth Page")).not.toBeInTheDocument();
  });
});
