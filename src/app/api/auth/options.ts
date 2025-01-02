import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getPool } from "../../../lib/db"; // データベース接続モジュール

/**
 * NextAuthの認証設定オプション
 */
export const authOptions: AuthOptions = {
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
          console.error("[signIn] アカウント情報または認証プロバイダーが不足しています。");
          return false;
        }

        // GitHubの場合、追加でメールアドレスを取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${account.access_token}`,
            },
          });
          if (!res.ok) {
            throw new Error(`[signIn] GitHubからメールアドレスの取得に失敗しました。ステータスコード: ${res.status}`);
          }

          const emails = await res.json();
          if (emails?.length) {
            user.email =
              emails.find((email: any) => email.primary && email.verified)
                ?.email || null;
          }
        }

        // メールアドレスが取得できない場合はサインインを中止
        if (!user.email) {
          console.error("[signIn] ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        const pool = await getPool(); // データベースプールを取得
        const request = pool.request();
        request.input("Name", user.name); // ユーザー名
        request.input("Email", user.email); // メールアドレス
        request.input("Provider", account.provider); // 認証プロバイダー名

        // ユーザーが存在しない場合、新規登録を実行
        const query = `
          IF NOT EXISTS (
            SELECT 1 FROM Users WHERE email = @Email
          )
          BEGIN
            INSERT INTO Users (name, email, provider) 
            VALUES (@Name, @Email, @Provider)
          END
        `;
        await request.query(query);

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
     * @param {object} param0.token JWTトークン
     * @returns {Promise<object>} 更新されたセッションオブジェクト
     */
    async session({ session, token }) {
      try {
        if (!session.user) {
          console.error("[session] セッション情報にユーザーが含まれていません。");
          return session;
        }

        const pool = await getPool(); // データベースプールを取得
        const result = await pool
          .request()
          .input("Email", session.user.email)
          .query("SELECT id FROM Users WHERE email = @Email");

        if (result.recordset.length === 0) {
          throw new Error("[session] データベースにユーザーIDが見つかりませんでした。");
        }

        // セッション情報にユーザーIDを追加
        session.user = Object.assign({}, session.user, {
          id: result.recordset[0]?.id || null,
        });
        console.log("[session] セッションにユーザーIDを追加しました。");
        return session;
      } catch (error) {
        console.error("[session] セッション生成時のエラー:", error);
        return session;
      }
    },
  },
};
