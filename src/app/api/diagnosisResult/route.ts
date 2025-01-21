import { NextRequest, NextResponse } from "next/server";
import { getLatestDiagnosisResult } from "../../../lib/getLatestDiagnosisResult";
import { getServerSessionUserId } from "../../../lib/getServerSessionUserId";
import { MBTIDiagnosisResult } from "../../../types";
import { getMBTIBias, getMBTIType } from "../../../utils/getMBTIType";

/**
 * 認証されたユーザーの最新の診断結果を取得するエンドポイント
 *
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {Promise<NextResponse<MBTIDiagnosisResult | { message: string }>>}
 */
export async function GET(req: NextRequest): Promise<NextResponse<MBTIDiagnosisResult | { message: string }>> {
  try {
    // 認証情報からユーザーIDを取得
    const userId = await getServerSessionUserId(req);

    // ユーザーIDが存在しない場合、未認証エラーを返す
    if (!userId) {
      console.error("[API診断結果] ユーザーIDが取得できません。未認証の可能性があります。");
      return NextResponse.json({ message: "認証されていません。ログインしてください。" }, { status: 401 });
    }

    // 最新の診断結果を取得
    const mTBIScore = await getLatestDiagnosisResult(userId);

    // 診断結果が見つからない場合
    if (!mTBIScore) {
      console.warn(`[API診断結果] ユーザーID: ${userId} に診断結果が存在しません。`);
      return NextResponse.json({ message: "診断結果が見つかりません。" }, { status: 404 });
    }

    // MTBIのタイプを計算する
    const mBTIType = getMBTIType(mTBIScore);

    // MTBIの傾きを計算する
    const mBTIBias = getMBTIBias(mTBIScore);

    // 正常に診断結果を返却
    return NextResponse.json({
      type: mBTIType,
      bias: mBTIBias,
      ratio: mTBIScore,
    });
  } catch (error) {
    // サーバーエラー時のログ出力とエラーレスポンス
    console.error("[API診断結果] サーバーエラー:", error);
    return NextResponse.json({ message: "診断結果の取得中にエラーが発生しました。" }, { status: 500 });
  }
}
