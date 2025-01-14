import NextAuth from "next-auth";
import { authOptions } from "../options";

/**
 * NextAuthのエンドポイントを処理するハンドラー
 *
 * このモジュールは認証のエンドポイントとして動作します。
 * GETおよびPOSTリクエストに対して同じハンドラーを使用します。
 *
 * @returns {NextApiHandler} NextAuthのAPIハンドラー
 */
const handler = NextAuth(authOptions);

// GETリクエストとPOSTリクエストを共通のハンドラーに割り当てる
// Next.jsのルーティングで利用可能にするためにエクスポート
export { handler as GET, handler as POST };
