import { drizzle as drizzleNeon } from "drizzle-orm/neon-serverless";
import { drizzle as drizzleNodePg } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

/**
 * Hyperdrive connection string type
 */
export interface HyperdriveConnection {
  connectionString: string;
}

/**
 * Detect if a connection string points to a local PostgreSQL instance
 */
function isLocalPostgres(url: string): boolean {
  return url.includes("localhost") || url.includes("127.0.0.1") || url.includes("host.docker.internal");
}

/**
 * Create a database client
 *
 * In Cloudflare Workers / Neon:
 * - Uses Neon serverless driver (WebSocket-based)
 *
 * In local development:
 * - Uses node-postgres (standard TCP connection)
 */
export function createDb(
  connectionString?: string | HyperdriveConnection,
) {
  let url: string;

  if (typeof connectionString === "string") {
    url = connectionString;
  } else if (connectionString && "connectionString" in connectionString) {
    url = connectionString.connectionString;
  } else {
    url = process.env.DATABASE_URL!;
  }

  // Use node-postgres for local development, Neon serverless for production
  if (isLocalPostgres(url)) {
    const pool = new Pool({ connectionString: url });
    return drizzleNodePg(pool, { schema });
  }

  // drizzle-orm/neon-serverless for Neon/Cloudflare
  return drizzleNeon(url, { schema });
}


/**
 * Database client type — works with both Neon serverless and node-postgres drivers
 */
export type Database = ReturnType<typeof drizzleNeon<typeof schema>> | ReturnType<typeof drizzleNodePg<typeof schema>>;

// Re-export schema for convenience
export { schema };
