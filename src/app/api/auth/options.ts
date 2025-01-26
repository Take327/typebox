import { Account, AuthOptions, Session, User } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getPool } from "../../../lib/db";
import { getUserInfoByEmail } from "../../../lib/getUserInfo";

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
    async signIn({ user, account }: { user: User; account: Account | null }): Promise<boolean> {
      try {
        if (!account || !account.provider) {
          console.error("[signIn] 認証プロバイダー情報が不足しています。");
          return false;
        }

        // GitHubプロバイダーの特殊処理
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${account.access_token}` },
          });

          // GitHub APIのレスポンスが正常でない場合はエラー
          if (!res.ok) {
            console.error(`[signIn] GitHubメール取得失敗: ${res.status}`);
            return false;
          }

          const emails = (await res.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
          user.email = emails.find((email) => email.primary && email.verified)?.email || null;
        }

        if (!user.email) {
          console.error("[signIn] ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        const pool = await getPool();
        await pool.request().input("Name", user.name).input("Email", user.email).input("Provider", account.provider)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
            BEGIN
              INSERT INTO Users (name, email, provider) VALUES (@Name, @Email, @Provider)
            END
          `);

        return true;
      } catch (error) {
        console.error("[signIn] エラー:", error);
        return false;
      }
    },

    async session({ session }: { session: Session }): Promise<Session> {
      try {
        if (!session.user?.email) {
          console.error("[session] ユーザー情報が不足しています。");
          return session;
        }

        const userInfo = await getUserInfoByEmail(session.user.email);
        session.user.id = userInfo.id;
        session.user.autoApproval = userInfo.auto_approval;

        return session;
      } catch (error) {
        console.error("[session] エラー:", error);
        return session;
      }
    },
  },
};
