import { createServer } from "../../src/createServer";
import supertest from "supertest";
import { AppTestDataSource } from "../../src/test-data-source";

describe("Test useraccount endpoints", () => {
  let server: any;
  let request: any;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    await AppTestDataSource.initialize();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("GET /api/users", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/users");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/users/test", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/users/test");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/users/userId/1", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/users/userId/1");
      expect(response.status).toBe(200);
      expect(response.body).toContain("auth0Id");
      expect(response.body).toContain("name");
    });

    it("should return 400 Bad request", async () => {
      const response = await request.get("/api/users/userId/test");
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/users", () => {
    it("should return 200 OK", async () => {
      const response = await request.post("/api/users").send({ name: "test" });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("test");
      expect(response.body.auth0Id).toBeNull();
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.post("/api/users").send({ name: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/users/1", () => {
    it("should return 200 OK", async () => {
      const response = await request.put("/api/users/1").send({ name: "test" });
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe("test");
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.put("/api/users/1").send({ name: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/users/userId", () => {
    it("should return 200 OK", async () => {
      const response = await request.delete("/api/users/1");
      expect(response.status).toBe(200);
    });

    it("should return 404 Not Found", async () => {
      const response = await request.delete("/api/users/10000");
      expect(response.status).toBe(404);
    });

    it("should return 400 Bad request", async () => {
      const response = await request.delete("/api/users/test");
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/users/userId/paintingId", () => {
    it("should return 200 OK", async () => {
      const response = await request.delete("/api/users/1/1");
      expect(response.status).toBe(200);
    });

    it("should return 404 Not Found", async () => {
      const response = await request.delete("/api/users/10000/100000");
      expect(response.status).toBe(404);
    });

    it("should return 400 Bad request", async () => {
      const response = await request.delete("/api/users/test/test");
      expect(response.status).toBe(404);
    });
  });
});
