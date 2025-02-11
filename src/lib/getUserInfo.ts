import { PoolClient } from "pg";
import { getPool } from "./db";

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
  const pool: PoolClient = await getPool();

  try {
    const query = "SELECT * FROM Users WHERE email = $1";
    const values = [email];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return null;
    }

    // result.rows[0] を UserInfo だとみなす
    return result.rows[0] as UserInfo;
  } catch (error) {
    console.error("Error executing query", error);
    throw error;
  } finally {
    // プールを閉じる必要がない場合は、ここでのクリーンアップは不要です
  }
}
