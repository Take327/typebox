import { Pool, PoolClient, PoolConfig } from "pg";

// 環境変数からデータベース接続情報を取得
const config: PoolConfig = {
  user: process.env.PGUSER || "",
  password: process.env.PGPASSWORD || "",
  host: process.env.PGHOST || "",
  database: process.env.PGDATABASE || "",
  port: Number(process.env.PGPORT) || 5432,
  max: 10, // 最大接続数
  idleTimeoutMillis: 30000, // 接続がアイドル状態でクローズされるまでの時間（ミリ秒）
  connectionTimeoutMillis: 2000, // 新しい接続を確立するまでのタイムアウト（ミリ秒）
};

// 接続プールのインスタンスを作成
const pool = new Pool(config);

/**
 * 接続プールの状態をログ出力
 */
const logPoolStatus = () => {
  console.log(`プールの総クライアント数: ${pool.totalCount}`);
  console.log(`アクティブなクライアント数: ${pool.waitingCount}`);
  console.log(`アイドル状態のクライアント数: ${pool.idleCount}`);
};

/**
 * リトライ機能付きでデータベース接続を取得する関数
 *
 * @param retries - リトライ回数（デフォルト: 3）
 * @param delayMs - リトライ間の待機時間（ミリ秒、デフォルト: 5000）
 * @returns {Promise<PoolClient>} - データベース接続クライアント
 */
const getPool = async (retries: number = 3, delayMs: number = 5000): Promise<PoolClient> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const client = await pool.connect();
      console.log("データベースに接続しました");
      logPoolStatus();
      return client;
    } catch (error) {
      console.error(`接続に失敗しました (試行回数: ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        // リトライ失敗
        throw error;
      }
      console.log(`${delayMs / 1000} 秒後に再試行します...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  // ここには基本的に到達しない想定
  throw new Error("接続のリトライがすべて失敗しました。");
};

/**
 * アプリケーション終了時にプール接続をクリーンアップ
 */
const cleanup = async () => {
  try {
    await pool.end();
    console.log("データベース接続を終了しました");
  } catch (error) {
    console.error("データベース接続の終了中にエラーが発生しました:", error);
  }
  process.exit();
};

// SIGINTとSIGTERMイベントリスナー
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

export { getPool };
