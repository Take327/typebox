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
      authorization: { params: { scope: "read:user user:email" } }, // ユーザー情報とメールアドレスの取得スコープを指定
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
  pages: {
    signIn: "/login", // カスタムログインページのパス
    error: "/auth/error", // 認証エラー発生時のリダイレクト先
  },
  secret: process.env.NEXTAUTH_SECRET, // JWTセッション暗号化用のシークレットキー
  session: { strategy: "jwt" }, // JWTを使用したセッション管理を有効化
  callbacks: {
    /**
     * サインイン時のコールバック処理
     * - ユーザーの認証情報を検証し、必要に応じてデータベースにユーザーを登録
     * - GitHub 認証時にメールアドレスが取得できない場合は、API から取得
     *
     * @param {User} user - 認証されたユーザー情報
     * @param {Account | null} account - 認証アカウント情報
     * @returns {Promise<boolean>} - 認証成功時はtrue、失敗時はfalse
     */
    async signIn({ user, account }: { user: User; account: Account | null }): Promise<boolean> {
      try {
        // 認証プロバイダー情報が不足している場合はエラー
        if (!account || !account.provider) {
          console.error("[signIn] 認証プロバイダー情報が不足しています。");
          return false;
        }

        // GitHub認証でメールアドレスが取得できない場合は、GitHub API から取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${account.access_token}` }, // GitHub API の認証トークン
          });

          // APIレスポンスが正常でない場合はエラーをスロー
          if (!res.ok) {
            console.error(`[signIn] GitHubメール取得失敗: ${res.status}`);
            return false;
          }

          // メールアドレス一覧を取得し、プライマリかつ認証済みのものを使用
          const emails = (await res.json()) as Array<{ email: string; primary: boolean; verified: boolean }>;
          user.email = emails.find((email) => email.primary && email.verified)?.email || null;
        }

        // ユーザーのメールアドレスが取得できない場合はエラー
        if (!user.email) {
          console.error("[signIn] ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        // データベース接続を取得
        const pool = await getPool();

        // ユーザーが存在しない場合は新規登録
        await pool.request().input("Name", user.name).input("Email", user.email).input("Provider", account.provider)
          .query(`
            IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
            BEGIN
              INSERT INTO Users (name, email, provider) VALUES (@Name, @Email, @Provider)
            END
          `);

        return true; // 認証成功
      } catch (error) {
        console.error("[signIn] エラー:", error);
        return false; // 認証失敗
      }
    },

    /**
     * セッション情報の取得時のコールバック処理
     * - データベースから追加情報（ユーザーID、自動承認フラグ）を取得
     *
     * @param {Session} session - セッションオブジェクト
     * @returns {Promise<Session>} - ユーザー情報を更新したセッション
     */
    async session({ session }: { session: Session }): Promise<Session> {
      try {
        // セッションにユーザーのメールアドレスがない場合はエラー
        if (!session.user?.email) {
          console.error("[session] ユーザー情報が不足しています。");
          return session;
        }

        // メールアドレスをキーにデータベースからユーザー情報を取得
        const userInfo = await getUserInfoByEmail(session.user.email);

        // セッションにユーザーIDと自動承認フラグを追加
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
