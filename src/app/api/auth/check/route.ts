import { NextRequest, NextResponse } from "next/server";
import { getServerSessionUserId } from "../../../../lib/getServerSessionUserId";

/**
 * GETメソッドで呼び出されるAPIハンドラー
 *
 * @param req - APIリクエストオブジェクト
 * @returns {Promise<NextResponse>} レスポンスオブジェクト
 */
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const userId = await getServerSessionUserId(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ userId }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/auth/check] エラー:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
