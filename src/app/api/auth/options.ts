import { AuthOptions, Session, User, Account } from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { getPool } from "../../../lib/db";
import { getUserInfoByEmail } from "../../../lib/getUserInfo";

/**
 * `Session` 型を拡張して `accessToken` を追加
 */
interface ExtendedSession extends Session {
  error?: string;
  accessToken?: string;
}

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
      authorization: { params: { scope: "read:user user:email" } },
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
      authorization: {
        params: {
          scope: "openid profile email offline_access",
          response_mode: "query",
        },
      },
      checks: ["pkce"],
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    updateAge: 6 * 60 * 60,
  },
  callbacks: {
    /**
     * サインイン時のコールバック処理
     */
    async signIn({ user, account }: { user: User; account: Account | null }): Promise<boolean> {
      try {
        if (!account || !account.provider) {
          console.error("[signIn] 認証プロバイダー情報が不足しています。");
          return false;
        }

        // GitHub認証でメールアドレスが取得できない場合は、GitHub API から取得
        if (account.provider === "github" && !user.email) {
          const res = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${account.access_token}` }, // GitHub API の認証トークン
          });

          if (!res.ok) {
            console.error(`[signIn] GitHubメール取得失敗: ${res.status}`);
            return false;
          }

          // メールアドレス一覧を取得し、プライマリかつ認証済みのものを使用
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

    /**
     * JWTトークンの管理処理
     */
    async jwt({ token, account }: any) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.accessTokenExpires = Date.now() + (account.expires_at ? account.expires_at * 1000 : 3600 * 1000);
      }

      if (token.accessTokenExpires && Date.now() > token.accessTokenExpires) {
        console.log("[jwt] アクセストークンの有効期限が切れています。リフレッシュ処理を開始します。");

        try {
          const url = "https://login.microsoftonline.com/common/oauth2/v2.0/token";
          const params = new URLSearchParams({
            client_id: process.env.MICROSOFT_ID!,
            client_secret: process.env.MICROSOFT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken,
          });

          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params,
          });

          if (!response.ok) {
            console.error("[jwt] リフレッシュトークンの更新に失敗しました");
            throw new Error("リフレッシュトークンの更新に失敗しました");
          }

          const refreshedTokens = await response.json();

          token.accessToken = refreshedTokens.access_token;
          token.accessTokenExpires = Date.now() + refreshedTokens.expires_in * 1000;
          token.refreshToken = refreshedTokens.refresh_token;
        } catch (error) {
          console.error("[jwt] Azure AD アクセストークンの更新に失敗:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },

    /**
     * セッション情報の取得時のコールバック処理
     */
    async session({ session, token }: { session: ExtendedSession; token: any }): Promise<ExtendedSession> {
      if (token?.error) {
        console.error("[session] トークンエラーが発生しました。セッションを無効化します。");
        return { ...session, error: token.error };
      }

      if (!session.user?.email) {
        console.error("[session] ユーザー情報が不足しています。");
        return session;
      }

      const userInfo = await getUserInfoByEmail(session.user.email);
      session.user.id = userInfo.id;
      session.user.autoApproval = userInfo.auto_approval;
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
