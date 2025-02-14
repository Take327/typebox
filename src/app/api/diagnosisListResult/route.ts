import { getPool } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { PoolClient } from "pg";

/**
 * ユーザーの診断結果を取得するAPI
 *
 * @param req - HTTPリクエスト
 * @returns JSONデータ
 */
export async function GET(req: NextRequest) {
  let client: PoolClient | undefined;

  try {
    // ✅ ユーザーIDの取得
    const userId = req.headers.get("x-user-id");
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "無効なユーザーID" }, { status: 400 });
    }

    client = await getPool();

    const query = `
      SELECT created_at, type_e, type_i, type_s, type_n, type_t, type_f, type_j, type_p
      FROM DiagnosisResults
      WHERE user_id = $1
      ORDER BY created_at ASC
    `;
    const result = await client.query(query, [Number(userId)]);

    // ✅ 診断データが存在しない場合
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "診断結果が見つかりません。", initialLogin: true }, { status: 200 });
    }

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

    console.log(formattedData);

    return NextResponse.json(formattedData, { status: 200 });
  } catch (error) {
    console.error("データベースエラー:", error);
    return NextResponse.json({ error: "内部サーバーエラー" }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
