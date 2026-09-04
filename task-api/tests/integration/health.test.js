const request = require("supertest");
const app = require("../../src/app");

describe("健康检查接口", () => {
  test("GET /api/v1/health 应返回服务状态", async () => {
    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.service).toBe("task-api");
    expect(response.body.data.status).toBe("ok");
  });

  test("未知接口应返回统一 404 响应", async () => {
    const response = await request(app).get("/api/v1/unknown");

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
