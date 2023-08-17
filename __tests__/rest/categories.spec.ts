import { createServer } from "../../src/createServer";
import supertest from "supertest";
import { AppTestDataSource } from "../../src/test-data-source";

describe("Test category endpoints", () => {
  let server: any;
  let request: any;
  const url = "/api/category";

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    await AppTestDataSource.initialize();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("GET /api/category", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/category/test", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url + "/test");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/category/categoryId", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url + "/1");
      expect(response.status).toBe(200);
      expect(response.body).toContain("auth0Id");
      expect(response.body).toContain("name");
    });

    it("should return 400 Bad request", async () => {
      const response = await request.get(url + "/fout");
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/category/", () => {
    it("should return 200 OK", async () => {
      const response = await request.post(url).send({ name: "test" });
      expect(response.status).toBe(200);
      expect(response.body.name).toBe("test");
      expect(response.body.auth0Id).toBeNull();
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.post(url).send({ name: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/category/1", () => {
    it("should return 200 OK", async () => {
      const response = await request.put(url + "/1").send({ name: "test" });
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.name).toBe("test");
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.put(url + "/1").send({ name: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/category/categoryId", () => {
    it("should return 200 OK", async () => {
      const response = await request.delete(url + "/1");
      expect(response.status).toBe(200);
    });

    it("should return 404 Not Found", async () => {
      const response = await request.delete(url + "/10000");
      expect(response.status).toBe(404);
    });

    it("should return 400 Bad request", async () => {
      const response = await request.delete(url + "/test");
      expect(response.status).toBe(400);
    });
  });
});
