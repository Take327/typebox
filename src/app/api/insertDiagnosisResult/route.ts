import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";
import sql from "mssql";

/**
 * 診断結果をデータベースに挿入するAPIエンドポイント
 *
 * このエンドポイントは、POSTリクエストを受信し、診断結果をデータベースに保存します。
 *
 * @param req - リクエストオブジェクト
 * @returns レスポンスオブジェクト
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { userId, scores } = body;

    // バリデーション
    if (
      !userId ||
      !scores ||
      !(
        "E" in scores &&
        "I" in scores &&
        "S" in scores &&
        "N" in scores &&
        "T" in scores &&
        "F" in scores &&
        "J" in scores &&
        "P" in scores
      )
    ) {
      return NextResponse.json(
        { message: "Invalid data format. Ensure userId and all scores are provided." },
        { status: 400 }
      );
    }

    const pool = await getPool(); // データベース接続プールを取得

    // INSERT クエリ
    const query = `
      INSERT INTO DiagnosisResults (user_id, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P)
      VALUES (@userId, @type_E, @type_I, @type_S, @type_N, @type_T, @type_F, @type_J, @type_P);
    `;

    // パラメータ化されたクエリでSQLインジェクション防止
    await pool
      .request()
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
    return NextResponse.json({ message: "Diagnosis result inserted successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error inserting diagnosis result:", error);
    return NextResponse.json(
      { message: "Failed to insert diagnosis result.", error: (error as Error).message },
      { status: 500 }
    );
  }
}
