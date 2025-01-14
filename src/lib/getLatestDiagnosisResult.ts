import { getPool } from "./db";
import sql from "mssql";
import { MBTIScore } from "../types";

/**
 * 指定されたユーザーIDに対応する最新の診断結果を取得する関数
 *
 * @param userId - ユーザーの一意の識別子
 * @returns {Promise<MBTIScore | null>} 最新の診断結果（データが存在しない場合はnullを返す）
 */
export async function getLatestDiagnosisResult(userId: number): Promise<MBTIScore | null> {
  try {
    const pool = await getPool();
    const query = `
      SELECT TOP 1 type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P
      FROM DiagnosisResults
      WHERE user_id = @user_id
      ORDER BY created_at DESC;
    `;

    const result = await pool.request().input("user_id", sql.Int, userId).query(query);

    if (result.recordset.length === 0) {
      return null; // データが見つからない場合
    }

    // データベースの結果を MBTIScore 型に変換
    const { type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P }: { [key: string]: number } =
      result.recordset[0];
    const mbtiScore: MBTIScore = {
      E: type_E,
      I: type_I,
      S: type_S,
      N: type_N,
      T: type_T,
      F: type_F,
      J: type_J,
      P: type_P,
    };

    return mbtiScore;
  } catch (error) {
    console.error("Error fetching latest diagnosis result:", error);
    throw error;
  }
}
