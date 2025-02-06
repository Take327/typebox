import { getPool } from "./db";
import sql from "mssql";

/**
 * 指定されたメールアドレスに対応するユーザー情報をデータベースから取得する。
 *
 * @param {string} email - 検索対象のユーザーのメールアドレス。
 * @returns {Promise<object | null>} ユーザー情報のオブジェクト（存在しない場合は `null`）。
 *
 * @throws {Error} データベース接続やクエリの実行に失敗した場合にエラーをスローする可能性がある。
 *
 * @example
 * ```ts
 * const user = await getUserInfoByEmail("user@example.com");
 * if (user) {
 *   console.log("User found:", user);
 * } else {
 *   console.log("User not found");
 * }
 * ```
 */
export async function getUserInfoByEmail(email: string): Promise<object | null> {
  // データベース接続プールを取得
  const pool = await getPool();

  // SQL クエリを実行し、指定されたメールアドレスのユーザー情報を取得
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");

  // ユーザーが存在しない場合は null を返す
  if (result.recordset.length === 0) {
    return null;
  }

  // 実際のテーブル定義に合わせたユーザーデータを返す
  return result.recordset[0];
}
