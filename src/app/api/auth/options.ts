import { Session, AuthOptions, Account, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getPool } from "../../../lib/db"; // データベース接続モジュール

/**
 * NextAuthの認証設定オプション
 */
export const authOptions: AuthOptions = {
  debug: process.env.NODE_ENV === "development", // 開発環境のみデバッグモードを有効化
  providers: [
    // GitHub認証プロバイダーの設定
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: "read:user user:email" } }, // 必要なスコープを指定
    }),
    // Google認証プロバイダーの設定
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // Microsoft Azure AD認証プロバイダーの設定
    AzureADProvider({
      clientId: process.env.MICROSOFT_ID!,
      clientSecret: process.env.MICROSOFT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // セッション暗号化用のシークレットキー
  session: { strategy: "jwt" }, // JWTを使用したセッション管理を設定
  callbacks: {
    /**
     * サインイン時のコールバック
     * @param {User} params.user - 認証されたユーザー情報
     * @param {Account | null} params.account - 認証アカウント情報
     * @returns {Promise<boolean>} サインイン成功時はtrue、失敗時はfalse
     */
    async signIn({
      user,
      account,
    }: {
      user: User;
      account: Account | null;
    }): Promise<boolean> {
      try {
        // アカウント情報が不足している場合はエラー
        if (!account || !account.provider) {
          console.error("[signIn] 認証プロバイダー情報が不足しています。");
          return false;
        }

        // GitHubの場合、メールアドレスを追加取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${account.access_token}` }, // アクセストークンを利用してリクエスト
          });

          // GitHub APIのレスポンスが正常でない場合はエラー
          if (!res.ok) {
            console.error(`[signIn] GitHubメール取得失敗: ${res.status}`);
            return false;
          }

          // GitHub APIのレスポンスからプライマリかつ検証済みのメールアドレスを取得
          const emails = (await res.json()) as Array<{
            email: string;
            primary: boolean;
            verified: boolean;
          }>;

          user.email =
            emails.find((email) => email.primary && email.verified)?.email ||
            null;
        }

        // メールアドレスが取得できない場合はエラー
        if (!user.email) {
          console.error("[signIn] ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        // データベース接続を取得
        const pool = await getPool();
        const query = `
          IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
          BEGIN
            INSERT INTO Users (name, email, provider) VALUES (@Name, @Email, @Provider)
          END
        `;

        // データベースにユーザー情報を登録
        await pool
          .request()
          .input("Name", user.name) // ユーザー名
          .input("Email", user.email) // メールアドレス
          .input("Provider", account.provider) // プロバイダー名
          .query(query);

        return true; // サインイン成功
      } catch (error) {
        // エラーログを出力してサインイン失敗
        console.error("[signIn] エラー:", error);
        return false;
      }
    },

    /**
     * セッション生成時のコールバック
     * @param {Session} params.session - セッション情報
     * @param {JWT} params.token - JWTトークン
     * @returns {Promise<Session>} 更新されたセッションオブジェクト
     */
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
      user?: User; // 必要に応じてユーザー情報を追加可能
    }): Promise<Session> {
      try {
        // セッションにユーザー情報またはメールアドレスが存在しない場合はエラー
        if (!session.user || !session.user.email) {
          console.error("[session] ユーザー情報が不足しています。");
          return session;
        }

        // データベース接続を取得
        const pool = await getPool();

        // メールアドレスに基づいてユーザーIDを取得
        const result = await pool
          .request()
          .input("Email", session.user.email)
          .query("SELECT id FROM Users WHERE email = @Email");

        // ユーザーIDが見つからない場合の処理
        if (result.recordset.length === 0) {
          console.error("[session] ユーザーIDが存在しません。");
          session.user.id = null; // セッションにnullを設定
          return session;
        }

        // セッションにユーザーIDを追加
        session.user.id = result.recordset[0]?.id || null;
        return session; // 更新されたセッションを返す
      } catch (error) {
        // エラーログを出力
        console.error("[session] エラー:", error);
        return session; // エラー時はそのままセッションを返す
      }
    },
  },
};
