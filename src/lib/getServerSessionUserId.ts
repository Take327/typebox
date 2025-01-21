import { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "../app/api/auth/options";

/**
 * サーバーサイドでセッション情報からユーザーIDを取得する関数
 *
 * @param req - リクエストオブジェクト
 * @returns {Promise<number | null>} ユーザーIDまたはnull
 */
export const getServerSessionUserId = async (req: NextRequest): Promise<number | null> => {
  try {
    // Next-Authからセッションを取得
    const session = (await getServerSession({ req, ...authOptions })) as Session;

    // セッションが存在しない場合のエラーハンドリング
    if (!session) {
      console.error("[getServerSessionUserId] セッションが取得できませんでした。");
      return null;
    }

    // ユーザー情報が不足している場合
    if (!session.user || !session.user.id) {
      console.error("[getServerSessionUserId] セッションにユーザー情報が含まれていません。", {
        session,
      });
      return null;
    }

    // ユーザーIDを返却
    return session.user.id;
  } catch (error) {
    // エラー発生時に詳細をログ出力
    console.error("[getServerSessionUserId] エラーが発生しました:", error);
    return null;
  }
};
