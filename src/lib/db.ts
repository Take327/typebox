import { Pool, PoolClient, PoolConfig } from "pg";
import { setTimeout } from "timers/promises";

const config: PoolConfig = {
  user: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
  host: process.env.PGHOST || "",
  database: process.env.PGDATABASE || "",
  port: Number(process.env.PGPORT) || 5432,
  max: 10,
  idleTimeoutMillis: 15000,
  connectionTimeoutMillis: 2000,
  ssl: process.env.PGHOST !== "localhost" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(config);

const getPool = async (retries: number = 3, delayMs: number = 5000): Promise<PoolClient> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(30000).then(() => controller.abort());

      const client = await Promise.race([
        pool.connect(),
        timeout.then(() => {
          throw new Error("データベース接続タイムアウト");
        }),
      ]);

      console.log("データベースに接続しました");
      return client;
    } catch (error) {
      console.error(`接続に失敗しました (試行回数: ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        // リトライ失敗
        throw error;
      }
      console.log(`${delayMs / 1000} 秒後に再試行します...`);
      await new Promise<void>((resolve) => globalThis.setTimeout(resolve, delayMs));
    }
  }
  throw new Error("接続のリトライがすべて失敗しました。");
};

export { getPool };
