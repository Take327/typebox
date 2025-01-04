import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "../../lib/db"; // データベース接続モジュールをインポート
import sql from "mssql"; // mssqlライブラリをインポート

/**
 * 診断結果をデータベースに挿入するAPIエンドポイント
 * 
 * このエンドポイントは、POSTリクエストを受信し、診断結果をデータベースに保存します。
 *
 * @param {NextApiRequest} req - APIリクエストオブジェクト
 * @param {NextApiResponse} res - APIレスポンスオブジェクト
 */
export default async function insertDiagnosisResult(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // POSTメソッド以外のリクエストを拒否
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method Not Allowed" });
    return;
  }

  const { userId, scores } = req.body; // scores = { E: 50, I: 50, ... }

  // リクエストボディのバリデーション
  if (
    !userId ||
    !scores ||
    !("E" in scores && "I" in scores && "S" in scores && "N" in scores &&
      "T" in scores && "F" in scores && "J" in scores && "P" in scores)
  ) {
    res.status(400).json({ message: "Invalid data format. Ensure userId and all scores are provided." });
    return;
  }

  try {
    const pool = await getPool(); // データベース接続プールを取得

    // INSERT クエリ
    const query = `
      INSERT INTO DiagnosisResults (user_id, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P)
      VALUES (@userId, @type_E, @type_I, @type_S, @type_N, @type_T, @type_F, @type_J, @type_P);
    `;

    // パラメータ化されたクエリでSQLインジェクション防止
    await pool.request()
      .input("userId", sql.Int, userId)
      .input("type_E", sql.Int, scores.E)
      .input("type_I", sql.Int, scores.I)
      .input("type_S", sql.Int, scores.S)
      .input("type_N", sql.Int, scores.N)
      .input("type_T", sql.Int, scores.T)
      .input("type_F", sql.Int, scores.F)
      .input("type_J", sql.Int, scores.J)
      .input("type_P", sql.Int, scores.P)
      .query(query);

    // 挿入成功時のレスポンス
    res.status(201).json({ message: "Diagnosis result inserted successfully." });
  } catch (error) {
    // error を型アサーションで特定の型にキャスト
    const err = error as Error; 
    console.error("Error inserting diagnosis result:", err.message);
    res.status(500).json({ message: "Failed to insert diagnosis result.", error: err.message });
  }
}
