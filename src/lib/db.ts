import { Pool, PoolClient, PoolConfig } from "pg";

const config: PoolConfig = {
  user: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
  host: process.env.PGHOST || "",
  database: process.env.PGDATABASE || "",
  port: Number(process.env.PGPORT) || 5432,
  max: 10, // 最大接続数
  idleTimeoutMillis: 15000, // アイドル状態で接続が閉じられる時間
  connectionTimeoutMillis: 2000, // 接続確立のタイムアウト
  ssl: process.env.PGHOST !== "localhost" ? { rejectUnauthorized: false } : false,
};

const pool = new Pool(config);

/**
 * データベース接続を取得する（リトライ機能付き）
 * @param retries 最大リトライ回数（デフォルト: 3）
 * @param delayMs リトライ間隔（ミリ秒、デフォルト: 5000）
 * @returns {Promise<PoolClient>} - データベース接続クライアント
 */
const getPool = async (retries: number = 3, delayMs: number = 5000): Promise<PoolClient> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("データベースに接続しました");
      return client;
    } catch (error) {
      console.error(`接続に失敗しました (試行回数: ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        throw error; // 最大リトライ回数を超えた場合はエラーを投げる
      }
      console.log(`${delayMs / 1000} 秒後に再試行します...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw new Error("接続のリトライがすべて失敗しました。");
};

/**
 * アプリケーション終了時にプールを解放
 */
const cleanup = async () => {
  try {
    await pool.end();
    console.log("データベース接続を終了しました");
  } catch (error) {
    console.error("データベース接続の終了中にエラーが発生しました:", error);
  }
};

// アプリ終了時のクリーンアップ処理
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export { getPool };
