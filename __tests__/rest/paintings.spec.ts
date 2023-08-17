import { createServer } from "../../src/createServer";
import supertest from "supertest";
import { AppTestDataSource } from "../../src/test-data-source";

describe("Test painting endpoints", () => {
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

  describe("GET /api/paintings", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/paintings");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/paintings/test", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/paintings/test");
      expect(response.status).toBe(200);
    });
  });

  describe("GET /api/paintings/1", () => {
    it("should return 200 OK", async () => {
      const response = await request.get("/api/paintings/1");
      expect(response.status).toBe(200);
      expect(response.body).toContain("title");
      expect(response.body).toContain("description");
      expect(response.body).toContain("imageFilePath");
      expect(response.body).toContain("price");
    });

    it("should return 400 Bad request", async () => {
      const response = await request.get("/api/paintings/fout");
      expect(response.status).toBe(400);
    });
  });

  describe("PUT /api/paintings/paintingId", () => {
    it("should return 200 OK", async () => {
      const response = await request.put("/api/paintings/1").send({
        title: "testTitle",
        description: "testDescription",
        imageFilePath: "testImageFilePath",
        price: 1,
      });
      expect(response.status).toBe(200);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe("testTitle");
      expect(response.body.description).toBe("testDescription");
      expect(response.body.imageFilePath).toBe("testImageFilePath");
      expect(response.body.price).toBe(1);
    });

    it("should return 400 Bad Request", async () => {
      const response = await request
        .put("/api/paintings/1")
        .send({ title: "" });
      expect(response.status).toBe(400);
    });
  });
});
