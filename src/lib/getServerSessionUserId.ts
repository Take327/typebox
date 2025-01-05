import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/options";
import { Session } from "next-auth";
import { NextRequest } from "next/server";

/**
 * サーバーサイドでセッション情報からユーザーIDを取得する関数
 *
 * @param req - リクエストオブジェクト
 * @returns {Promise<number | null>} ユーザーID
 */
export const getServerSessionUserId = async (req: NextRequest): Promise<number | null> => {
  try {
    const session = (await getServerSession({ req, ...authOptions })) as Session; // 型アサーションでSession型を指定

    if (!session || !session.user || !session.user.id) {
      console.error("[getServerSessionUserId] セッション情報が不足しています。");
      return null;
    }

    return session.user.id; // ユーザーIDを返却
  } catch (error) {
    console.error("[getServerSessionUserId] エラー:", error);
    return null;
  }
};
