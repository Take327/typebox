// src/app/api/diagnosisResult/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserId } from "@/lib/getServerSessionUserId";
import { getLatestDiagnosisResult } from "@/lib/getLatestDiagnosisResult";
import { MBTIScore } from "@/types";
import { convertScoreToDiagnosisResult } from "@/utils/mbti/mbtiUtils";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // 1) ユーザー認証
    const userId = await getServerSessionUserId(req);
    if (!userId) {
      return NextResponse.json({ message: "認証されていません。" }, { status: 401 });
    }

    // 2) DBの生データを取得 (DiagnosisRow)
    const dbRow = await getLatestDiagnosisResult(userId);
    if (!dbRow) {
      return NextResponse.json({ message: "診断結果が見つかりません。", initialLogin: true }, { status: 200 });
    }

    // 3) DB列 (type_E など) を MBTIScore へマッピング
    //    すでに計算済みのパーセントが入っている前提なら、そのままコピー
    const score: MBTIScore = {
      E: dbRow.type_E,
      I: dbRow.type_I,
      S: dbRow.type_S,
      N: dbRow.type_N,
      T: dbRow.type_T,
      F: dbRow.type_F,
      J: dbRow.type_J,
      P: dbRow.type_P,
    };

    // 4) 既存のユーティリティ関数でさらに MBTIDiagnosisResult に変換
    const diagnosisResult = convertScoreToDiagnosisResult(score);

    // 5) フロントエンドが使いやすい形でレスポンスを返す
    return NextResponse.json(diagnosisResult);
  } catch (error) {
    console.error("[GET /api/diagnosisResult] サーバーエラー:", error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
