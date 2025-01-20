import sql from "mssql";
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "../../../lib/db";

/**
 * 診断結果をデータベースに挿入するAPIエンドポイント
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

    // スコアを検証し整数に変換
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

    const pool = await getPool(); // データベース接続プールを取得

    // INSERT クエリ
    const query = `
      INSERT INTO DiagnosisResults (user_id, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P)
      VALUES (@userId, @type_E, @type_I, @type_S, @type_N, @type_T, @type_F, @type_J, @type_P);
    `;

    // パラメータ化されたクエリで挿入処理
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

    return NextResponse.json({ message: "Diagnosis result inserted successfully." }, { status: 201 });
  } catch (error) {
    console.error("Error inserting diagnosis result:", error);
    return NextResponse.json(
      {
        message: "Failed to insert diagnosis result.",
        step: "Database query execution",
        error: (error as Error).message,
      },
      { status: 500 }
    );
  }
}
