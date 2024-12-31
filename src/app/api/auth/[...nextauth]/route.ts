import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions: AuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    AzureADProvider({
      clientId: process.env.MICROSOFT_ID!,
      clientSecret: process.env.MICROSOFT_SECRET!,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
