import sql from "mssql"; // mssqlライブラリをインポート

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
 * データベース接続プールを取得する関数
 *
 * この関数は、データベース接続プールを管理し、複数の接続を効率的に扱えるようにします。
 * 接続が未確立の場合、新しいプールを作成します。
 *
 * @returns {Promise<sql.ConnectionPool>} - データベース接続プール
 */
export const getPool = async (): Promise<sql.ConnectionPool> => {
  if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
    throw new Error("データベース接続情報が不足しています。環境変数を確認してください。");
  }

  if (!pool) {
    // 接続プールが未初期化の場合、新しいConnectionPoolを作成
    pool = new sql.ConnectionPool(config);

    // プールを接続し、接続エラーがあればキャッチ
    try {
      await pool.connect();
      console.log("データベースに接続しました");
    } catch (error) {
      console.error("データベース接続エラー:", error);
      throw error; // エラーを呼び出し元に伝播
    }
  }

  // 既存のプールを返却
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
