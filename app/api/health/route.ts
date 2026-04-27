export async function GET() {
  return Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version ?? "unknown",
    region: process.env.CLOUD_RUN_REGION ?? "local"
  }, { status: 200 });
}
