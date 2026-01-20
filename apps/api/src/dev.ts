import { serve } from "@hono/node-server";
import { api as app } from "./app";

const port = 3001;

console.log(`🚀 Helpdesk API server starting on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
}, (info) => {
  console.log(`✅ Helpdesk API server running on http://localhost:${info.port}`);
});
