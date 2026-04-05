require("./setup");
const request = require("supertest");
const axios = require("axios");
const app = require("../app");

jest.mock("axios");

let token;

beforeEach(async () => {
  const res = await request(app).post("/api/auth/register").send({
    name: "Books User",
    email: "books@example.com",
    password: "password123",
  });
  token = res.body.token;
});

// Helper to mock a Google Books volume detail response (used by the save route)
const mockVolumeDetail = (overrides = {}) => ({
  data: {
    volumeInfo: {
      title: "Test Book",
      authors: ["Test Author"],
      description: "A test description",
      categories: ["Fiction"],
      publishedDate: "2020",
      imageLinks: { thumbnail: "http://example.com/img.jpg" },
      infoLink: "http://example.com",
      ...overrides,
    },
  },
});

describe("GET /api/google-books", () => {
  it("returns 400 when no query is provided", async () => {
    const res = await request(app).get("/api/google-books");
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/search query/i);
  });

  it("returns books for a valid query", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "vol1",
            volumeInfo: {
              title: "Fiction Book",
              authors: ["Author A"],
              description: "Great book",
              language: "en",
              publishedDate: "2021",
              categories: ["Fiction"],
              imageLinks: { thumbnail: "http://img.com/1.jpg" },
              infoLink: "http://books.google.com/1",
            },
          },
        ],
      },
    });

    const res = await request(app).get("/api/google-books?q=fiction");
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(1);
    expect(res.body.books[0].title).toBe("Fiction Book");
    expect(res.body.books[0].id).toBe("vol1");
  });

  it("returns empty array when Google Books returns no items", async () => {
    axios.get.mockResolvedValueOnce({ data: {} });
    const res = await request(app).get("/api/google-books?q=zzzzunknown");
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(0);
  });

  it("filters out non-English books", async () => {
    axios.get.mockResolvedValueOnce({
      data: {
        items: [
          {
            id: "vol-fr",
            volumeInfo: { title: "Livre Français", language: "fr", authors: [] },
          },
          {
            id: "vol-en",
            volumeInfo: {
              title: "English Book",
              language: "en",
              authors: [],
              description: "",
              publishedDate: "2020",
              categories: [],
            },
          },
        ],
      },
    });

    const res = await request(app).get("/api/google-books?q=books");
    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(1);
    expect(res.body.books[0].title).toBe("English Book");
  });
});

describe("POST /api/google-books/save", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app)
      .post("/api/google-books/save")
      .send({ volumeId: "vol123" });
    expect(res.status).toBe(401);
  });

  it("returns 400 when volumeId is missing", async () => {
    const res = await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({});
    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/volumeId/i);
  });

  it("saves a book and returns 201", async () => {
    axios.get.mockResolvedValueOnce(mockVolumeDetail());

    const res = await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-save-1" });

    expect(res.status).toBe(201);
    expect(res.body.book.title).toBe("Test Book");
    expect(res.body.book.volumeId).toBe("vol-save-1");
  });

  it("returns 409 when saving a duplicate volumeId", async () => {
    axios.get.mockResolvedValue(mockVolumeDetail());

    await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-dup" });

    const res = await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-dup" });

    expect(res.status).toBe(409);
    expect(res.body.message).toMatch(/already exists/i);
  });
});

describe("GET /api/google-books/saved", () => {
  it("returns 401 without authentication", async () => {
    const res = await request(app).get("/api/google-books/saved");
    expect(res.status).toBe(401);
  });

  it("returns the user's saved books", async () => {
    axios.get.mockResolvedValueOnce(mockVolumeDetail({ title: "My Saved Book" }));

    await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-saved-1" });

    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(1);
    expect(res.body.books[0].title).toBe("My Saved Book");
  });

  it("does not return books saved by other users", async () => {
    // Save a book as user 1
    axios.get.mockResolvedValueOnce(mockVolumeDetail({ title: "User1 Book" }));
    await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-user1" });

    // Register user 2 and fetch their saved books
    const res2 = await request(app).post("/api/auth/register").send({
      name: "User Two",
      email: "user2@example.com",
      password: "pass123",
    });
    const token2 = res2.body.token;

    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", `Bearer ${token2}`);

    expect(res.status).toBe(200);
    expect(res.body.books).toHaveLength(0);
  });
});

describe("DELETE /api/google-books/saved/:id", () => {
  it("deletes a saved book", async () => {
    axios.get.mockResolvedValueOnce(mockVolumeDetail());

    const saveRes = await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-delete-1" });

    const bookId = saveRes.body.book._id;

    const res = await request(app)
      .delete(`/api/google-books/saved/${bookId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toMatch(/deleted successfully/i);
  });

  it("returns 404 for a non-existent book", async () => {
    const res = await request(app)
      .delete("/api/google-books/saved/507f1f77bcf86cd799439011")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});

describe("POST /api/google-books/saved/:id/reviews", () => {
  it("adds a review to a saved book", async () => {
    axios.get.mockResolvedValueOnce(mockVolumeDetail());

    const saveRes = await request(app)
      .post("/api/google-books/save")
      .set("Authorization", `Bearer ${token}`)
      .send({ volumeId: "vol-review-1" });

    const bookId = saveRes.body.book._id;

    const res = await request(app)
      .post(`/api/google-books/saved/${bookId}/reviews`)
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, comment: "Excellent read!" });

    expect(res.status).toBe(201);
    expect(res.body.review.rating).toBe(5);
    expect(res.body.review.comment).toBe("Excellent read!");
  });

  it("returns 404 when book does not exist", async () => {
    const res = await request(app)
      .post("/api/google-books/saved/507f1f77bcf86cd799439011/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 4, comment: "Good" });
    expect(res.status).toBe(404);
  });
});
