/**
 * @jest-environment node
 */
import { GET } from "../../app/api/health/route";

describe("Health API", () => {
  it("returns 200 with status ok", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toBe("ok");
    expect(typeof data.timestamp).toBe("string");
    expect(data.version).toBeDefined();
    expect(data.region).toBeDefined();
  });

  it("handles missing environment variables with fallbacks", async () => {
    const originalVersion = process.env.npm_package_version;
    const originalRegion = process.env.CLOUD_RUN_REGION;

    delete process.env.npm_package_version;
    delete process.env.CLOUD_RUN_REGION;

    const response = await GET();
    const data = await response.json();

    expect(data.version).toBe("unknown");
    expect(data.region).toBe("local");

    process.env.npm_package_version = originalVersion;
    process.env.CLOUD_RUN_REGION = originalRegion;
  });
});
