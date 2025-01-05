import { NextResponse, NextRequest } from "next/server";
import { getLatestDiagnosisResult } from "../../../lib/getLatestDiagnosisResult";
import { getServerSessionUserId } from "../../../lib/getServerSessionUserId";
import { MBTIDiagnosisResult } from "../../../types";
import { getMBTIType, getMBTIBias } from "../../../utils/getMBTIType";

/**
 * 認証されたユーザーの最新の診断結果を取得するエンドポイント
 *
 * このエンドポイントは、ログイン中のユーザーの最新の診断結果を取得し、MBTIタイプとその傾きを計算して返します。
 * ユーザーが認証されていない場合や診断結果が存在しない場合は、適切なエラーメッセージを返します。
 *
 * @param {NextRequest} req - リクエストオブジェクト
 * @returns {Promise<NextResponse<MBTIDiagnosisResult | { message: string }>>}
 *   - 診断結果（`MBTIDiagnosisResult` 型）を含むレスポンス
 *   - または、エラーメッセージを含むレスポンス
 *
 * @example
 * // リクエスト例
 * GET /api/diagnosisResult
 *
 * // レスポンス例（成功時: MBTIDiagnosisResult）
 * {
 *   "type": "ENTP",
 *   "bias": {
 *     "EvsI": 20,
 *     "SvsN": 10,
 *     "TvsF": 30,
 *     "JvsP": 50
 *   },
 *   "ratio": {
 *     "E": 60,
 *     "I": 40,
 *     "S": 45,
 *     "N": 55,
 *     "T": 70,
 *     "F": 30,
 *     "J": 20,
 *     "P": 80
 *   }
 * }
 *
 * // レスポンス例（未認証）
 * {
 *   "message": "認証されていません。ログインしてください。"
 * }
 *
 * // レスポンス例（診断結果なし）
 * {
 *   "message": "診断結果が見つかりません。"
 * }
 *
 * // レスポンス例（サーバーエラー）
 * {
 *   "message": "診断結果の取得中にエラーが発生しました。"
 * }
 */
export async function GET(
  req: NextRequest
): Promise<NextResponse<MBTIDiagnosisResult | { message: string }>> {
  try {
    // 認証情報からユーザーIDを取得
    const userId = await getServerSessionUserId(req);

    // ユーザーIDが存在しない場合、未認証エラーを返す
    if (!userId) {
      return NextResponse.json(
        { message: "認証されていません。ログインしてください。" },
        { status: 401 }
      );
    }

    // 最新の診断結果を取得
    const mTBIScore = await getLatestDiagnosisResult(userId);

    // 診断結果が見つからない場合
    if (!mTBIScore) {
      return NextResponse.json(
        { message: "診断結果が見つかりません。" },
        { status: 404 }
      );
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
    // エラーメッセージを日本語化して返却
    console.error("診断結果取得中にエラーが発生しました:", error);
    return NextResponse.json(
      { message: "診断結果の取得中にエラーが発生しました。" },
      { status: 500 }
    );
  }
}
