import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import BookCard from "../components/BookCard";

const mockBook = {
  id: "vol123",
  title: "The Great Gatsby",
  authors: ["F. Scott Fitzgerald"],
  description: "A story of the fabulously wealthy Jay Gatsby.",
  thumbnail: null,
  publishedDate: "1925-04-10",
  categories: ["Fiction"],
};

describe("BookCard", () => {
  it("renders the book title", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText("The Great Gatsby")).toBeInTheDocument();
  });

  it("renders the author name", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText("F. Scott Fitzgerald")).toBeInTheDocument();
  });

  it("renders the book description (truncated if needed)", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText(/fabulously wealthy/i)).toBeInTheDocument();
  });

  it("shows 'Save to Library' button when logged in", () => {
    render(<BookCard book={mockBook} isLoggedIn={true} onSave={vi.fn()} />);
    expect(screen.getByRole("button", { name: /save to library/i })).toBeInTheDocument();
  });

  it("hides 'Save to Library' button when not logged in", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.queryByRole("button", { name: /save to library/i })).not.toBeInTheDocument();
  });

  it("calls onSave with the book id when Save button is clicked", () => {
    const onSave = vi.fn();
    render(<BookCard book={mockBook} isLoggedIn={true} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /save to library/i }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith("vol123");
  });

  it("renders the category badge", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText("Fiction")).toBeInTheDocument();
  });

  it("renders the published year", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText("1925")).toBeInTheDocument();
  });

  it("shows a placeholder icon when there is no thumbnail", () => {
    render(<BookCard book={mockBook} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it("renders a thumbnail image when provided", () => {
    const bookWithImage = { ...mockBook, thumbnail: "http://example.com/img.jpg" };
    render(<BookCard book={bookWithImage} isLoggedIn={false} onSave={vi.fn()} />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "http://example.com/img.jpg");
    expect(img).toHaveAttribute("alt", "The Great Gatsby");
  });

  it("shows 'Unknown author' when authors array is empty", () => {
    const bookNoAuthor = { ...mockBook, authors: [] };
    render(<BookCard book={bookNoAuthor} isLoggedIn={false} onSave={vi.fn()} />);
    expect(screen.getByText("Unknown author")).toBeInTheDocument();
  });
});
