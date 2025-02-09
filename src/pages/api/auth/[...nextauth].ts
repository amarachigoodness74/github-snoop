import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "github") {
        const client = await MongoClient.connect(uri);
        const db = client.db("github_snoop");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({
          email: user.email,
        });

        // If user does not exist, insert into DB
        if (!existingUser) {
          await usersCollection.insertOne({
            name: user.name,
            email: user.email,
            avatar: user.image,
            createdAt: new Date(),
            searchHistory: [],
          });
        }
      }
      return true;
    },
    async session({ session, token }) {
      if (token?.username && session.user) {
        session.user.email = token.email;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.email = user.email;
      }
      return token;
    },
  },
});
