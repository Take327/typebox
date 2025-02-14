import { NextRequest, NextResponse } from "next/server";
import { PoolClient } from "pg";
import { getPool } from "@/lib/db";
import { DiagnosisRow, MBTIDiagnosisResultFromServer } from "@/types";
import { diagnosisRowToMBTIScore, convertScoreToDiagnosisResult, getMBTIType } from "@/utils/mbti/mbtiUtils";

/**
 * 最新の診断結果を取得する API ルート
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  let client: PoolClient | undefined;

  try {
    // ✅ ユーザーIDの取得
    const userId = req.headers.get("x-user-id");
    if (!userId || isNaN(Number(userId))) {
      return NextResponse.json({ error: "無効なユーザーID" }, { status: 400 });
    }

    client = await getPool();

    // ✅ クエリの実行
    const query = `
      SELECT user_id, type_e, type_i, type_s, type_n, type_t, type_f, type_j, type_p
      FROM DiagnosisResults
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const result = await client.query(query, [Number(userId)]);

    // ✅ 診断データが存在しない場合
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "診断結果が見つかりません。", initialLogin: true }, { status: 200 });
    }

    const diagnosisRow: DiagnosisRow = result.rows[0];
    console.log("診断結果取得:", diagnosisRow); // デバッグログ

    // ✅ `DiagnosisRow` を `MBTIScore` に変換
    const mbtiScore = diagnosisRowToMBTIScore(diagnosisRow);
    if (!mbtiScore) {
      console.error("診断データの変換に失敗しました:", diagnosisRow);
      return NextResponse.json({ error: "診断データの変換に失敗しました。" }, { status: 500 });
    }

    // ✅ MBTIタイプを判定
    const mbtiType = getMBTIType(mbtiScore);
    if (!mbtiType) {
      console.error("MBTIタイプの判定に失敗しました:", mbtiScore);
      return NextResponse.json({ error: "MBTIタイプの判定に失敗しました。" }, { status: 500 });
    }

    // ✅ `MBTIScore` を `MBTIDiagnosisResultFromServer` に変換
    const responseData: MBTIDiagnosisResultFromServer = {
      type: mbtiType,
      ratio: mbtiScore,
      bias: {
        EvsI: mbtiScore.I - mbtiScore.E,
        SvsN: mbtiScore.N - mbtiScore.S,
        TvsF: mbtiScore.F - mbtiScore.T,
        JvsP: mbtiScore.P - mbtiScore.J,
      },
    };

    console.log("APIレスポンスデータ:", responseData); // デバッグログ

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("[GET /api/diagnosisResult] エラー:", error);
    return NextResponse.json({ error: "サーバーエラー" }, { status: 500 });
  } finally {
    if (client) {
      client.release();
    }
  }
}
