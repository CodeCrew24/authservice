const request = require("supertest");
const app = require("../app"); // Assuming your Express app is exported from the file
const User = require("../models/User");
const bcrypt = require("bcrypt");

describe("Register a new user", () => {
  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});
  });

  it("should register a new user successfully", async () => {
    const response = await request(app)
      .post("/auth/register/")
      .set("username", "test_user")
      .set("password", "test_password")
      .set("role", "user"); // or any role you want to assign

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("clientId");
    expect(response.body).toHaveProperty("clientSecret");
  });

  it("should not allow registration with an existing username", async () => {
    // Create a user with the same username as the one we want to register
    await User.create({
      username: "existing_user",
      password: await bcrypt.hash("existing_password", 10),
      role: "user",
    });

    const response = await request(app)
      .post("/auth/register")
      .set("username", "existing_user")
      .set("password", "test_password")
      .set("role", "user");

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty(
      "message",
      "Username is already taken"
    );
  });

  // it("should return 500 if registration fails due to server error", async () => {
  //   // Intentionally trigger a server error by not providing required data
  //   const response = await request(app).post("/auth/register").send({});

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty("error");
  // });
});

describe("Login with creds", () => {
  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});
  });

  it("should return 401 if login with invalid client credentials", async () => {
    const response = await request(app)
      .post("/auth/login/client")
      .set("clientid", "invalid_client_id")
      .set("clientsecret", "invalid_client_secret");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty(
      "message",
      "Invalid client credentials"
    );
  });

  // it("should return 500 if login fails due to server error", async () => {
  //   // Intentionally trigger a server error by not providing required data
  //   const response = await request(app).post("/auth/login/client").send({});

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty("error");
  // });

  // it("should return 500 if client ID and secret retrieval fails due to server error", async () => {
  //   // Intentionally trigger a server error by not providing required data
  //   const response = await request(app).get("/auth/client").send({});

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty("error");
  // });
});

describe("Regenerate client creds", () => {
  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});
  });
  // it("should regenerate client credentials if credentials are valid", async () => {
  //   // Create a user with known credentials
  //   const user = await User.create({
  //     username: "test_user",
  //     password: await bcrypt.hash("test_password", 10),
  //     role: "user",
  //     clientId: "old_client_id",
  //     clientSecret: "old_client_secret",
  //   });

  //   const response = await request(app)
  //     .post("/auth/regenerate-client-credentials")
  //     .set("username", "test_user")
  //     .set("password", "test_password");

  //   expect(response.status).toBe(200);
  //   expect(response.body).toHaveProperty("clientId");
  //   expect(response.body).toHaveProperty("clientSecret");
  //   expect(response.body.clientId).not.toBe("old_client_id");
  //   expect(response.body.clientSecret).not.toBe("old_client_secret");
  // });

  it("should return 401 if credentials are invalid when regenerating client credentials", async () => {
    const response = await request(app)
      .post("/auth/regenerate-client-credentials")
      .set("username", "non_existing_user")
      .set("password", "invalid_password");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("message", "Invalid credentials");
  });

  // it("should return 500 if client credentials regeneration fails due to server error", async () => {
  //   // Intentionally trigger a server error by not providing required data
  //   const response = await request(app)
  //     .post("/auth/regenerate-client-credentials")
  //     .send({});

  //   expect(response.status).toBe(500);
  //   expect(response.body).toHaveProperty("error");
  // });
});

describe("Get User creds", () => {
  beforeEach(async () => {
    // Clear the user collection before each test
    await User.deleteMany({});
  });
  it("Should return creds if username and passwords are valid", async () => {
    // Create a user with known credentials
    const user = await User.create({
      username: "test_user",
      password: await bcrypt.hash("test_password", 10),
      role: "user",
      clientId: "test_client_id",
      clientSecret: "test_client_secret",
    });

    const response = await request(app)
      .get("/auth/client")
      .set("username", "test_user")
      .set("password", "test_password");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("clientId", "test_client_id");
    expect(response.body).toHaveProperty("clientSecret", "test_client_secret");
  });
});
