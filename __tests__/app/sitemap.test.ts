/**
 * @jest-environment node
 */
import sitemap from "../../app/sitemap";

describe("Sitemap", () => {
  it("returns a list of URLs with correct base path from environment", () => {
    process.env.NEXT_PUBLIC_APP_URL = "https://test.app";
    const result = sitemap();
    
    expect(result).toHaveLength(4);
    expect(result[0].url).toBe("https://test.app");
    expect(result[1].url).toBe("https://test.app/en");
    expect(result[2].url).toBe("https://test.app/hi");
    expect(result[3].url).toBe("https://test.app/mr");
    
    result.forEach(entry => {
      expect(entry.lastModified).toBeInstanceOf(Date);
      expect(entry.changeFrequency).toBeDefined();
      expect(entry.priority).toBeDefined();
    });
  });

  it("falls back to default URL if process.env.NEXT_PUBLIC_APP_URL is missing", () => {
    const originalUrl = process.env.NEXT_PUBLIC_APP_URL;
    delete process.env.NEXT_PUBLIC_APP_URL;
    
    const result = sitemap();
    expect(result[0].url).toBe("https://civicshield.app");
    
    process.env.NEXT_PUBLIC_APP_URL = originalUrl;
  });
});
