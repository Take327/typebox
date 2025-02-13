import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

/**
 * 診断結果をデータベースに挿入する API エンドポイント
 *
 * @param {NextRequest} req - HTTP リクエストオブジェクト（POST リクエスト）
 * @returns {Promise<NextResponse>} - 挿入成功時はステータス 201 のレスポンスを返す
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // リクエストボディを JSON として取得
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
        { message: "無効なデータ形式です。userId とすべてのスコアが提供されていることを確認してください。" },
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

    console.log("診断結果を挿入します:", { userId, scores: validatedScores });

    // データベース接続プールを取得
    const pool = await getPool();

    // INSERT クエリ（ユーザーの診断結果を保存）
    const query = `
      INSERT INTO DiagnosisResults (user_id, type_e, type_i, type_s, type_n, type_t, type_f, type_j, type_p)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);
    `;

    // SQL クエリのパラメータを設定して安全にデータを挿入
    const values = [
      userId,
      validatedScores.E,
      validatedScores.I,
      validatedScores.S,
      validatedScores.N,
      validatedScores.T,
      validatedScores.F,
      validatedScores.J,
      validatedScores.P,
    ];

    await pool.query(query, values);

    console.log("診断結果の挿入に成功しました。");

    // 成功時のレスポンスを返す
    return NextResponse.json(
      { message: "診断結果の挿入に成功しました。" },
      { status: 201 } // 201 Created を返す
    );
  } catch (error) {
    console.error("診断結果の挿入中にエラーが発生しました:", error);

    // エラーが発生した場合、詳細なエラーメッセージとともにレスポンスを返す
    return NextResponse.json(
      {
        message: "診断結果の挿入に失敗しました。",
        step: "データベースクエリの実行", // どの処理中にエラーが発生したかを明記
        error: (error as Error).message, // エラーメッセージを取得
      },
      { status: 500 } // 500 Internal Server Error を返す
    );
  }
}
