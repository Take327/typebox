import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserId } from "@/lib/getServerSessionUserId";
import { getLatestDiagnosisResult } from "@/lib/getLatestDiagnosisResult";

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // セッションからユーザーIDを取得
    const userId = await getServerSessionUserId(req);

    if (!userId) {
      return NextResponse.json({ message: "認証されていません。" }, { status: 401 });
    }

    // 診断結果を取得
    const diagnosisResult = await getLatestDiagnosisResult(userId);

    if (!diagnosisResult) {
      // 初回ログインの場合や診断結果がない場合のレスポンス
      return NextResponse.json({ message: "診断結果が見つかりません。", initialLogin: true }, { status: 200 });
    }

    return NextResponse.json(diagnosisResult);
  } catch (error) {
    console.error("[API診断結果] サーバーエラー:", error);
    return NextResponse.json({ message: "エラーが発生しました。" }, { status: 500 });
  }
}
