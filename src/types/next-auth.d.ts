import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number | null; // ユーザーIDを含む
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}