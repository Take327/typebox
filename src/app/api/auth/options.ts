import { AuthOptions } from "next-auth";
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
      clientId: process.env.GITHUB_ID!, // GitHubアプリのクライアントID
      clientSecret: process.env.GITHUB_SECRET!, // GitHubアプリのクライアントシークレット
      authorization: {
        params: {
          scope: "read:user user:email", // ユーザー情報とメールアドレスの取得を許可
        },
      },
    }),
    // Google認証プロバイダーの設定
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!, // GoogleクライアントID
      clientSecret: process.env.GOOGLE_SECRET!, // Googleクライアントシークレット
    }),
    // Microsoft Azure AD認証プロバイダーの設定
    AzureADProvider({
      clientId: process.env.MICROSOFT_ID!, // Azure ADクライアントID
      clientSecret: process.env.MICROSOFT_SECRET!, // Azure ADクライアントシークレット
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // セッション暗号化用のシークレットキー
  session: {
    strategy: "jwt", // セッション管理にJWTを使用
  },
  callbacks: {
    /**
     * サインイン時のコールバック
     *
     * @param {object} param0 サインイン時の情報
     * @param {object} param0.user ユーザー情報
     * @param {object} param0.account 認証アカウント情報
     * @returns {Promise<boolean>} サインイン成功時はtrue、失敗時はfalse
     */
    async signIn({ user, account }) {
      try {
        if (!account || !account.provider) {
          console.error("[signIn] 認証プロバイダー情報が不足しています。");
          return false;
        }

        // GitHub認証の場合、メールアドレスを追加取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${account.access_token}`,
            },
          });

          if (!res.ok) {
            console.error(`[signIn] GitHubメール取得失敗: ステータスコード ${res.status}`);
            return false;
          }

          const emails = (await res.json()) as Array<{
            email: string;
            primary: boolean;
            verified: boolean;
          }>;

          user.email = emails.find((email) => email.primary && email.verified)?.email || null;
        }

        if (!user.email) {
          console.error("[signIn] ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        // データベースにユーザー情報を登録
        const pool = await getPool();
        const query = `
          IF NOT EXISTS (SELECT 1 FROM Users WHERE email = @Email)
          BEGIN
            INSERT INTO Users (name, email, provider) VALUES (@Name, @Email, @Provider)
          END
        `;
        await pool
          .request()
          .input("Name", user.name)
          .input("Email", user.email)
          .input("Provider", account.provider)
          .query(query);

        console.log("[signIn] ユーザー情報を登録しました、または既に存在します。");
        return true;
      } catch (error) {
        console.error("[signIn] サインイン時のエラー:", error);
        return false;
      }
    },

    /**
     * セッション生成時のコールバック
     *
     * @param {object} param0 セッション情報
     * @param {object} param0.session セッションオブジェクト
     * @returns {Promise<object>} 更新されたセッションオブジェクト
     */
    async session({ session }) {
      try {
        if (!session.user || !session.user.email) {
          console.error("[session] ユーザーまたはメール情報がセッションに存在しません。");
          return session;
        }
    
        const pool = await getPool();
        const result = await pool
          .request()
          .input("Email", session.user.email)
          .query("SELECT id FROM Users WHERE email = @Email");
    
        if (result.recordset.length === 0) {
          console.error("[session] ユーザーIDがデータベースに存在しません。Email:", session.user.email);
          session.user.id = null; // 明示的にnullを設定
          return session;
        }
    
        // ユーザーIDをセッションに追加
        session.user.id = result.recordset[0]?.id || null;
        console.log("[session] ユーザーIDをセッションに追加しました:", session.user.id);
        return session;
      } catch (error) {
        console.error("[session] セッション生成時のエラー:", error);
        return session;
      }
    }
    
  },
};
