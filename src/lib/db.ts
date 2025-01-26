import sql from "mssql";

// データベース接続設定
const config: sql.config = {
  user: process.env.DB_USER || "", // データベースユーザー名（環境変数から取得）
  password: process.env.DB_PASSWORD || "", // データベースパスワード（環境変数から取得）
  server: process.env.DB_SERVER || "", // データベースサーバーのアドレス（環境変数から取得）
  database: process.env.DB_NAME || "", // データベース名（環境変数から取得）
  options: {
    encrypt: true, // データ転送時の暗号化を有効化（Azure SQL Database などで推奨）
    enableArithAbort: true, // 推奨設定
  },
  pool: {
    max: 10, // 最大接続数
    min: 0, // 最小接続数
    idleTimeoutMillis: 30000, // 接続アイドルタイムアウト
    acquireTimeoutMillis: 30000, // プール接続取得のタイムアウト
  },
};

// 接続プールオブジェクトを格納
// 初期値はnullで、最初の呼び出し時に初期化されます
let pool: sql.ConnectionPool | null = null;

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
 * データベース接続プールを取得する関数
 *
 * この関数は、データベース接続プールを管理し、複数の接続を効率的に扱えるようにします。
 * 接続が未確立の場合、新しいプールを作成します。
 *
 * @returns {Promise<sql.ConnectionPool>} - データベース接続プール
 */
export const getPool = async (): Promise<sql.ConnectionPool> => {
  logPoolStatus(); // プール状態をログ出力

  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    throw new Error("データベース接続情報が不足しています。環境変数を確認してください。");
  }

  if (!pool || !pool.connected) {
    // 接続プールが未初期化または閉じられている場合、新しいプールを作成
    pool = new sql.ConnectionPool(config);

    try {
      await pool.connect();
      console.log("データベースに接続しました");
    } catch (error) {
      console.error("データベース接続エラー:", error);
      const typedError = error as { code?: string; message?: string };
      // 特定のエラーコードに応じたハンドリングを追加
      if (typedError.code === "ETIMEOUT") {
        console.error("接続がタaイムアウトしました。サーバー設定やネットワークを確認してください。");
      } else if (typedError.code === "ECONNCLOSED") {
        console.error("接続が閉じられました。再接続を試みます。");
      }

      throw error; // エラーを再スロー
    }
  }

  logPoolStatus(); // 接続後のプール状態を再確認
  return pool;
};

/**
 * SIGINTイベントリスナー
 *
 * このリスナーは、アプリケーションがCtrl+CまたはSIGINTシグナルを受信したときに実行されます。
 * データベース接続プールが存在する場合、接続を安全に閉じてからプロセスを終了します。
 */
process.on("SIGINT", async () => {
  if (pool) {
    try {
      // データベース接続プールを安全に閉じる
      await pool.close();
      console.log("データベース接続を閉じました");
    } catch (error) {
      // エラーハンドリング: 接続を閉じる際に失敗した場合
      console.error("データベース接続のクローズ中にエラーが発生しました:", error);
    }
  }

  // プロセスの正常終了
  process.exit();
});
