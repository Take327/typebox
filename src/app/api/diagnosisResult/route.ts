import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserId } from "@/lib/getServerSessionUserId";
import { getLatestDiagnosisResult } from "@/lib/getLatestDiagnosisResult";

/**
 * 診断結果を取得するAPIエンドポイント (GET /api/diagnosisResult)
 *
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {Promise<NextResponse>} 診断結果またはエラーレスポンス
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // セッションからユーザーIDを取得
    const userId = await getServerSessionUserId(req);
    console.log("デバッグ: UserID =", userId);

    // 認証されていない場合は401エラーを返す
    if (!userId) {
      console.warn("認証エラー: ユーザーIDが取得できませんでした。");
      return NextResponse.json({ message: "認証されていません。" }, { status: 401 });
    }

    // 診断結果をデータベースから取得
    const diagnosisResult = await getLatestDiagnosisResult(userId);
    console.log("デバッグ: 診断結果 =", diagnosisResult);

    // 診断結果がない場合は、初回ログインの可能性があるため特別なレスポンスを返す
    if (!diagnosisResult) {
      console.warn("診断結果なし: 初回ログインの可能性あり");
      return NextResponse.json({ message: "診断結果が見つかりません。", initialLogin: true }, { status: 200 });
    }

    // 診断結果を正常に返す
    return NextResponse.json(diagnosisResult);
  } catch (error) {
    // 予期しないサーバーエラーが発生した場合
    console.error("[API診断結果] サーバーエラー:", error);

    return NextResponse.json({ message: "エラーが発生しました。" }, { status: 500 });
  }
}
