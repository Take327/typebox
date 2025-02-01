// lib/getLatestDiagnosisResult.ts
import { DiagnosisRow } from "@/types";
import { getPool } from "./db";
import sql from "mssql";

/**
 * 指定されたユーザーIDの最新診断結果（DB生レコード）を取得する関数
 *
 * @param userId ユーザーID
 * @returns DiagnosisRow | null
 */
export async function getLatestDiagnosisResult(userId: number): Promise<DiagnosisRow | null> {
  try {
    const pool = await getPool();
    const query = `
      SELECT TOP 1
        user_id, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P
      FROM DiagnosisResults
      WHERE user_id = @user_id
      ORDER BY created_at DESC;
    `;
    const result = await pool.request().input("user_id", sql.Int, userId).query(query);

    if (result.recordset.length === 0) {
      return null;
    }

    // DBの生データをそのまま返す
    return result.recordset[0] as DiagnosisRow;
  } catch (error) {
    console.error("Error fetching latest diagnosis result:", error);
    throw error;
  }
}
