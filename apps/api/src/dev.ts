import { serve } from "@hono/node-server";
import { api as app } from "./app";

const port = Number(process.env.API_PORT) || 3013;

console.log(`🚀 API server starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✅ API server running on http://localhost:${info.port}`);
});
