//src\app\api\diagnosisListResult\route.ts
import { NextRequest, NextResponse } from "next/server";
import { getPool } from "@/lib/db";
import sql from "mssql";

/**
 * ユーザーの診断結果を取得するAPI
 *
 * @param req - HTTPリクエスト
 * @returns JSONデータ
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const userId = Number(url.searchParams.get("user_id"));

  if (!userId || !Number.isInteger(userId)) {
    return NextResponse.json({ error: "Invalid or missing user_id" }, { status: 400 });
  }

  try {
    const pool = await getPool();
    const result = await pool.request().input("user_id", sql.Int, userId).query(`
        SELECT 
          created_at, type_E, type_I, type_S, type_N, type_T, type_F, type_J, type_P 
        FROM [dbo].[DiagnosisResults] 
        WHERE user_id = @user_id
        ORDER BY created_at ASC
      `);

    const formattedData = result.recordset.map((row) => ({
      date: new Intl.DateTimeFormat("ja-JP", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date(row.created_at))
        .replace(/\//g, "-"),
      E: row.type_E,
      I: row.type_I,
      S: row.type_S,
      N: row.type_N,
      T: row.type_T,
      F: row.type_F,
      J: row.type_J,
      P: row.type_P,
    }));

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
