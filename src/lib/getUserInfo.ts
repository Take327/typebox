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

interface UserInfo {
  id: number;
  auto_approval: boolean;
  // 他に必要なカラムがあれば追加
}
export async function getUserInfoByEmail(email: string): Promise<UserInfo | null> {
  const pool = await getPool();
  const result = await pool
    .request()
    .input("email", sql.VarChar, email)
    .query("SELECT * FROM Users WHERE email = @email");

  if (result.recordset.length === 0) {
    return null;
  }
  // recordset[0] を UserInfo だとみなす
  return result.recordset[0] as UserInfo;
}
