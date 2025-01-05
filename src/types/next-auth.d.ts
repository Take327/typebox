// src/types/next-auth.d.ts など (パスは任意ですが、プロジェクトが参照できるように)
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Session 型の拡張
   */
  interface Session {
    user: {
      /** ここに追加したいプロパティ */
      id: number | null;
      // 必要に応じて好きなプロパティを追加する
    } & DefaultSession["user"];
  }
}