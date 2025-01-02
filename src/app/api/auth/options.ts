import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { getPool } from "../../../lib/db"; // データベース接続モジュール

export const authOptions: AuthOptions = {
  providers: [
    // GitHub認証プロバイダー
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: "read:user user:email",
        },
      },
    }),
    // Google認証プロバイダー
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    // Microsoft Azure AD認証プロバイダー
    AzureADProvider({
      clientId: process.env.MICROSOFT_ID!,
      clientSecret: process.env.MICROSOFT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // セッション管理のためのシークレット
  session: {
    strategy: "jwt", // JWTを使用したセッション管理
  },
  callbacks: {
    // サインイン時のコールバック
    async signIn({ user, account }) {
      try {
        if (!account || !account.provider) {
          console.error("アカウント情報または認証プロバイダーが不足しています。");
          return false;
        }

        // GitHubの場合、追加でメールアドレスを取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: {
              Authorization: `token ${account.access_token}`,
            },
          });
          const emails = await res.json();
          if (emails?.length) {
            user.email =
              emails.find((email: any) => email.primary && email.verified)
                ?.email || null;
          }
        }

        if (!user.email) {
          console.error("ユーザーのメールアドレスが取得できませんでした。");
          return false;
        }

        const pool = await getPool(); // プールを取得
        const request = pool.request();
        request.input("Name", user.name);
        request.input("Email", user.email);
        request.input("Provider", account.provider);

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

        console.log("ユーザー情報を登録しました、または既に存在します。");
        return true;
      } catch (error) {
        console.error("サインイン時のエラー:", error);
        return false;
      }
    },
    // セッション生成時のコールバック
    async session({ session, token }) {
      try {
        if (!session.user) {
          console.error("セッション情報にユーザーが含まれていません。");
          return session;
        }

        const pool = await getPool(); // プールを取得
        const result = await pool
          .request()
          .input("Email", session.user.email)
          .query("SELECT id FROM Users WHERE email = @Email");

        session.user = Object.assign({}, session.user, {
          id: result.recordset[0]?.id || null,
        });
        console.log("セッションにユーザーIDを追加しました。");
        return session;
      } catch (error) {
        console.error("セッション生成時のエラー:", error);
        return session;
      }
    },
  },
};
