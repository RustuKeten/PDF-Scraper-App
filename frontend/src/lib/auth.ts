/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        action: { label: "Action", type: "hidden" }, // "login" or "register"
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const { email, password, action } = credentials;

        try {
          if (action === "register") {
            // Check if user already exists
            const existingUser = await prisma.user.findUnique({
              where: { email },
            });

            if (existingUser) {
              throw new Error("User already exists with this email");
            }

            // Hash password and create new user
            const hashedPassword = await bcrypt.hash(password, 12);
            const newUser = await prisma.user.create({
              data: {
                email,
                name: email.split("@")[0],
                password: hashedPassword, // We need to add this field to schema
                credits: 1000, // Starting credits
                planType: "FREE",
              },
            });

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              image: newUser.image,
            };
          } else {
            // Login - find user by email
            const user = await prisma.user.findUnique({
              where: { email },
            });

            if (!user) {
              throw new Error("No user found with this email");
            }

            // Check if user has password (for users created via OAuth)
            if (!user.password) {
              throw new Error("Please sign in with your social account");
            }

            const isValidPassword = await bcrypt.compare(
              password,
              user.password
            );
            if (!isValidPassword) {
              throw new Error("Invalid password");
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image,
            };
          }
        } catch (error: any) {
          console.error("Auth error:", error);
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
};
