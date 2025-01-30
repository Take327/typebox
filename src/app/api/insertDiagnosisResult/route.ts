import sql from "mssql";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

/**
 * 診断結果をデータベースに挿入するAPIエンドポイント
 *
 * @param {NextRequest} req - HTTPリクエストオブジェクト（POSTリクエスト）
 * @returns {Promise<NextResponse>} - 挿入成功時はステータス 201 のレスポンスを返す
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディをJSONとして取得
    const body = await req.json();
    const { userId, scores } = body;

    // 入力データのバリデーション
    if (
      !userId || // userId が提供されているか
      !scores || // scores オブジェクトが存在するか
      !(
        "E" in scores &&
        "I" in scores &&
        "S" in scores &&
        "N" in scores &&
        "T" in scores &&
        "F" in scores &&
        "J" in scores &&
        "P" in scores
      ) // すべてのスコアタイプ (E, I, S, N, T, F, J, P) が存在するか
    ) {
      return NextResponse.json(
        { message: "Invalid data format. Ensure userId and all scores are provided." },
        { status: 400 }
      );
    }

    // スコアを整数に変換し、数値であることを保証
    const validatedScores = {
      E: parseInt(scores.E, 10) || 0,
      I: parseInt(scores.I, 10) || 0,
      S: parseInt(scores.S, 10) || 0,
      N: parseInt(scores.N, 10) || 0,
      T: parseInt(scores.T, 10) || 0,
      F: parseInt(scores.F, 10) || 0,
      J: parseInt(scores.J, 10) || 0,
      P: parseInt(scores.P, 10) || 0,
    };

    console.log("Inserting diagnosis result:", { userId, scores: validatedScores });

    // データベース接続プールを取得
    const pool = await getPool();

    // INSERT クエリ（ユーザーの診断結果を保存）
    const query = `
      INSERT INTO DiagnosisResults (user_id, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P)
      VALUES (@userId, @type_E, @type_I, @type_S, @type_N, @type_T, @type_F, @type_J, @type_P);
    `;

    // SQLクエリのパラメータを設定して安全にデータを挿入
    await pool
      .request()
      .input("userId", sql.Int, userId)
      .input("type_E", sql.Int, validatedScores.E)
      .input("type_I", sql.Int, validatedScores.I)
      .input("type_S", sql.Int, validatedScores.S)
      .input("type_N", sql.Int, validatedScores.N)
      .input("type_T", sql.Int, validatedScores.T)
      .input("type_F", sql.Int, validatedScores.F)
      .input("type_J", sql.Int, validatedScores.J)
      .input("type_P", sql.Int, validatedScores.P)
      .query(query);

    console.log("Diagnosis result inserted successfully.");

    // 成功時のレスポンスを返す
    return NextResponse.json(
      { message: "Diagnosis result inserted successfully." },
      { status: 201 } // 201 Created を返す
    );
  } catch (error) {
    console.error("Error inserting diagnosis result:", error);

    // エラーが発生した場合、詳細なエラーメッセージとともにレスポンスを返す
    return NextResponse.json(
      {
        message: "Failed to insert diagnosis result.",
        step: "Database query execution", // どの処理中にエラーが発生したかを明記
        error: (error as Error).message, // エラーメッセージを取得
      },
      { status: 500 } // 500 Internal Server Error を返す
    );
  }
}
