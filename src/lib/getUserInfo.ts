// 例: getUserInfoByEmail のサンプル
import { getPool } from "./db";
import sql from "mssql";

export async function getUserInfoByEmail(email: string) {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");

  if (result.recordset.length === 0) {
    // 存在しない場合は null を返すなど
    // throw new Error("User not found"); // ← こうすると 500 が返る原因に
    return null;
  }

  // 実際のテーブル定義に合わせてユーザーデータを返す
  return result.recordset[0];
}
