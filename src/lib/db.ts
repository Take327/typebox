import sql from "mssql";

// データベース接続設定
const config: sql.config = {
  user: process.env.DB_USER || "",
  password: process.env.DB_PASSWORD || "",
  server: process.env.DB_SERVER || "",
  database: process.env.DB_NAME || "",
  options: {
    encrypt: true, // データ転送時の暗号化を有効化（Azure SQL Database などで推奨）
    enableArithAbort: true, // 推奨設定
  },
  pool: {
    max: 10, // 最大接続数
    min: 0, // 最小接続数
    idleTimeoutMillis: 60000, // 接続アイドルタイムアウト(ミリ秒)
    acquireTimeoutMillis: 60000, // プール接続取得のタイムアウト(ミリ秒)
  },
};

// 接続プールオブジェクトを格納
let pool: sql.ConnectionPool | null = null;
// 接続開始中かどうかを示す Promise を保持
let poolPromise: Promise<sql.ConnectionPool> | null = null;

/**
 * 接続プールの状態をログ出力
 */
const logPoolStatus = () => {
  if (pool) {
    console.log(`プール状態: connected=${pool.connected}, connecting=${pool.connecting}`);
  } else {
    console.log("プールは未初期化です");
  }
};

/**
 * リトライしながらデータベース接続を行う
 */
async function connectWithRetry(
  connectionPool: sql.ConnectionPool,
  retries: number = 3,
  delayMs: number = 5000
): Promise<sql.ConnectionPool> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await connectionPool.connect();
      return connectionPool;
    } catch (error) {
      console.error(`接続に失敗しました (attempt: ${attempt}/${retries}):`, error);
      if (attempt === retries) {
        // リトライ失敗
        throw error;
      }
      console.log(`再試行まで ${delayMs / 1000} 秒待機...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  // ここには基本的に到達しない想定
  throw new Error("接続リトライが失敗しました。");
}

/**
 * データベース接続プールを取得する関数
 *
 * @returns {Promise<sql.ConnectionPool>} - データベース接続プール
 */
export const getPool = async (): Promise<sql.ConnectionPool> => {
  // すでにプールがあり、接続済み
  if (pool && pool.connected) {
    return pool;
  }

  // 接続中または接続開始したPromiseがある場合
  if (poolPromise) {
    return poolPromise;
  }

  // 必要な環境変数が揃っているかを簡単にチェック（必要ならここを厳格化）
  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    throw new Error("データベース接続情報が不足しています。環境変数を確認してください。");
  }

  // 新しい接続プールを生成し、リトライ付きで接続
  poolPromise = (async () => {
    pool = new sql.ConnectionPool(config);
    await connectWithRetry(pool, 3, 5000);
    console.log("データベースに接続しました");
    logPoolStatus();
    return pool;
  })();

  return poolPromise;
};

/**
 * アプリケーション終了時にプール接続をクリーンアップ
 */
const cleanup = async () => {
  if (pool) {
    try {
      await pool.close();
      console.log("データベース接続を閉じました");
    } catch (error) {
      console.error("データベース接続のクローズ中にエラーが発生しました:", error);
    }
  }
  process.exit();
};

// SIGINTとSIGTERMイベントリスナー
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);
