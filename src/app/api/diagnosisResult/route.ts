import { NextRequest, NextResponse } from "next/server";
import { getCachedLatestDiagnosisResult } from "../../../lib/getCachedDiagnosisResult";
import { getServerSessionUserId } from "../../../lib/getServerSessionUserId";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getServerSessionUserId(req);

    if (!userId) {
      return NextResponse.json({ message: "認証されていません。" }, { status: 401 });
    }

    // キャッシュまたはデータベースから診断結果を取得
    const diagnosisResult = await getCachedLatestDiagnosisResult(userId);

    if (!diagnosisResult) {
      return NextResponse.json({ message: "診断結果が見つかりません。" }, { status: 404 });
    }

    return NextResponse.json(diagnosisResult);
  } catch (error) {
    console.error("[API診断結果] サーバーエラー:", error);
    return NextResponse.json({ message: "エラーが発生しました。" }, { status: 500 });
  }
}
