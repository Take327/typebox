import { getPool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

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
    return NextResponse.json({ error: "無効なまたは欠落している user_id" }, { status: 400 });
  }

  try {
    const pool = await getPool();
    const query = `
      SELECT user_id, type_e, type_i, type_s, type_n, type_t, type_f, type_j, type_p
      FROM DiagnosisResults
      WHERE user_id = $1
      ORDER BY created_at ASC
    `;
    const values = [userId];
    const result = await pool.query(query, values);

    const formattedData = result.rows.map((row) => ({
      date: new Intl.DateTimeFormat("ja-JP", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      })
        .format(new Date(row.created_at))
        .replace(/\//g, "-"),
      E: row.type_E,
      I: row.type_i,
      S: row.type_s,
      N: row.type_n,
      T: row.type_t,
      F: row.type_f,
      J: row.type_j,
      P: row.type_p,
    }));

    return NextResponse.json(Response, { status: 200 });
  } catch (error) {
    console.error("データベースエラー:", error);
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 });
  }
}
