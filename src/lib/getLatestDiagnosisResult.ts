// lib/getLatestDiagnosisResult.ts
import { DiagnosisRow } from "@/types";
import { PoolClient } from "pg";
import { getPool } from "./db";

/**
 * 指定されたユーザーIDの最新の診断結果を取得する関数
 *
 * @param userId ユーザーID
 * @returns DiagnosisRow | null
 */
export async function getLatestDiagnosisResult(userId: number): Promise<DiagnosisRow | null> {
  try {
    const pool: PoolClient = await getPool();
    const query = `
      SELECT
        user_id, type_e, type_i, type_s, type_n, type_t, type_f, type_j, type_p
      FROM DiagnosisResults
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await pool.query(query, [userId]);

    if (result.rows.length === 0) {
      return null;
    }

    // データベースから取得した生データをそのまま返す
    return result.rows[0] as DiagnosisRow;
  } catch (error) {
    console.error("最新の診断結果の取得中にエラーが発生しました:", error);
    throw error;
  }
}
