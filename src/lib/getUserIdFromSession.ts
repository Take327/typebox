import { getServerSession } from "next-auth/next";
import { authOptions } from "../app/api/auth/options";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * サーバーサイドでセッション情報からユーザーIDを取得
 *
 * @param {NextApiRequest} req - APIリクエストオブジェクト
 * @param {NextApiResponse} res - APIレスポンスオブジェクト
 * @returns {Promise<number | null>} ユーザーID
 */
export const getUserIdFromSession = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<number | null> => {
  try {
    const session = await getServerSession(req, res, authOptions);
    if (!session || !session.user || !session.user.id) {
      console.error("[getUserIdFromSession] セッション情報が見つかりません。");
      return null;
    }

    return session.user.id;
  } catch (error) {
    console.error("[getUserIdFromSession] セッション取得中にエラー:", error);
    return null;
  }
};
