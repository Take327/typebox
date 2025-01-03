import sql from "mssql"; // mssqlライブラリをインポート

// 環境変数が正しく設定されているか確認
if (!process.env.DB_USER || !process.env.DB_PASSWORD || !process.env.DB_SERVER || !process.env.DB_NAME) {
  throw new Error("環境変数が正しく設定されていません。DB_USER, DB_PASSWORD, DB_SERVER, DB_NAME を確認してください。");
}

// データベース接続設定
const config: sql.config = {
  user: process.env.DB_USER || "", // データベースユーザー名
  password: process.env.DB_PASSWORD || "", // データベースパスワード
  server: process.env.DB_SERVER || "", // データベースサーバーのアドレス
  database: process.env.DB_NAME || "", // データベース名
  options: {
    encrypt: true, // データ転送時の暗号化を有効化（Azure SQL Database などで推奨）
    enableArithAbort: true, // 算術エラーの発生時に接続を中止（推奨設定）
  },
  pool: {
    max: 10, // 最大接続数
    min: 0, // 最小接続数
    idleTimeoutMillis: 30000, // 接続アイドルタイムアウト（30秒）
  },
};

// 接続プールオブジェクトを格納
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
  if (!pool) {
    // 接続プールが未初期化の場合、新しいConnectionPoolを作成
    pool = new sql.ConnectionPool(config);

    try {
      await pool.connect(); // プールを接続
      console.log("[Database] データベースに接続しました");
    } catch (error) {
      console.error("[Database] データベース接続エラー:", error);
      pool = null; // 接続失敗時にプールをリセット
      throw error; // エラーを呼び出し元に伝播
    }
  }
  return pool; // 既存のプールを返却
};

/**
 * データベース接続を閉じる関数
 *
 * サーバーが終了する際に呼び出すことで、すべての接続をクリーンアップします。
 */
export const closePool = async (): Promise<void> => {
  if (pool) {
    try {
      await pool.close(); // プールを閉じる
      console.log("[Database] データベース接続を閉じました");
      pool = null;
    } catch (error) {
      console.error("[Database] プールクローズエラー:", error);
    }
  }
};

// 型キャストを使用して `on` メソッドにアクセス
(sql as any).on("error", (err: Error) => {
  console.error("[mssql] エラー:", err);
});