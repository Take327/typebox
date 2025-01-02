import sql from "mssql"; // mssqlライブラリをインポート

// データベース接続設定
const config: sql.config = {
  user: process.env.DB_USER || "", // データベースユーザー名（環境変数から取得）
  password: process.env.DB_PASSWORD || "", // データベースパスワード（環境変数から取得）
  server: process.env.DB_SERVER || "", // データベースサーバーのアドレス（環境変数から取得）
  database: process.env.DB_NAME || "", // データベース名（環境変数から取得）
  options: {
    encrypt: true, // データ転送時の暗号化を有効化（Azure SQL Database などで推奨）
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
