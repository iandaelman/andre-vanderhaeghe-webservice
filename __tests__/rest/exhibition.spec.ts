import { createServer } from "../../src/createServer";
import supertest from "supertest";
import { AppTestDataSource } from "../../src/test-data-source";

describe("Test exhibition endpoints", () => {
  let server: any;
  let request: any;
  const url = "/api/exhibition";

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    await AppTestDataSource.initialize();
  });

  afterAll(async () => {
    await server.stop();
  });

  describe("GET /api/exhibition", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/exhibition/test", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url + "/test");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/exhibition/exhibitionId", () => {
    it("should return 200 OK", async () => {
      const response = await request.get(url + "/1");
      expect(response.status).toBe(200);
      expect(response.body).toContain("title");
      expect(response.body).toContain("description");
      expect(response.body).toContain("startdate");
      expect(response.body).toContain("enddate");
    });

    it("should return 400 Bad request", async () => {
      const response = await request.get(url + "/fout");
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/exhibition", () => {
    it("should return 200 OK", async () => {
      const response = await request.post(url).send({
        title: "test",
        description: "Dit is test",
        startdate: "2025-01-01",
        enddate: "2025-01-02",
      });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe("test");
      expect(response.body.description).toBe("Dit is test");
      expect(response.body.startdate).toBe("2025-01-01");
      expect(response.body.enddate).toBe("2025-01-02");
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.post(url).send({ title: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/exhibition/1", () => {
    it("should return 200 OK", async () => {
      const response = await request.put(url + "/1").send({
        title: "test2",
        description: "Dit is test2",
        startdate: "2025-01-01",
        enddate: "2025-01-02",
      });
      expect(response.status).toBe(200);
      expect(response.body.title).toBe("test2");
      expect(response.body.description).toBe("Dit is test2");
      expect(response.body.startdate).toBe("2025-01-01");
      expect(response.body.enddate).toBe("2025-01-02");
    });

    it("should return 400 Bad Request", async () => {
      const response = await request.put(url + "/1").send({ name: "" });
      expect(response.status).toBe(400);
    });
  });

  describe("DELETE /api/exhibition/exhibitionId", () => {
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
