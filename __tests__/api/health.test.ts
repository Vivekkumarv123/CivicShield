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
});
