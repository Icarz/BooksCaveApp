const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

// Fallback env vars for test environment
if (!process.env.JWT_SECRET) process.env.JWT_SECRET = "test_secret_key";

const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
