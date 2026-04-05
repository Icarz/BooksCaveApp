require("./setup");
const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

const JWT_SECRET = process.env.JWT_SECRET || "test_secret_key";

describe("Auth Middleware (protect)", () => {
  it("returns 401 with message when no token is provided", async () => {
    const res = await request(app).get("/api/google-books/saved");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, no token");
  });

  it("returns 401 when token is malformed", async () => {
    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", "Bearer notavalidtoken");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, invalid token");
  });

  it("returns 401 when token is signed with wrong secret", async () => {
    const badToken = jwt.sign({ id: "507f1f77bcf86cd799439011" }, "wrong_secret");
    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", `Bearer ${badToken}`);
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Not authorized, invalid token");
  });

  it("returns 401 when token is expired", async () => {
    const expiredToken = jwt.sign(
      { id: "507f1f77bcf86cd799439011" },
      JWT_SECRET,
      { expiresIn: "0s" }
    );
    await new Promise((r) => setTimeout(r, 50));
    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", `Bearer ${expiredToken}`);
    expect(res.status).toBe(401);
  });

  it("allows access with a valid token", async () => {
    const registerRes = await request(app).post("/api/auth/register").send({
      name: "Auth User",
      email: "authtest@example.com",
      password: "password123",
    });
    const token = registerRes.body.token;

    const res = await request(app)
      .get("/api/google-books/saved")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
  });
});
