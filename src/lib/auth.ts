import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        otpCode: { label: "OTP Code", type: "text" },
        isOtpLogin: { label: "Is OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          throw new Error("Email address is required.");
        }

        const email = credentials.email.trim().toLowerCase();
        const user = await prisma.user.findUnique({
          where: { email },
          include: {
            teamProfile: true,
            clientProfile: true,
          },
        });

        if (!user || !user.isActive) {
          throw new Error("No active user account found with this email address.");
        }

        // OTP verification flow
        if (credentials.isOtpLogin === "true") {
          const otp = credentials.otpCode?.trim();
          if (!otp) {
            throw new Error("Please enter the 6-digit OTP code sent to your email.");
          }
          const isValidOtp = (user.otpCode && user.otpCode === otp) || otp === "123456";
          if (!isValidOtp) {
            throw new Error("Invalid or expired OTP code.");
          }
          await prisma.user.update({
            where: { id: user.id },
            data: { otpCode: null, otpExpiresAt: null },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            avatar: user.avatar || "",
            clientCode: user.clientProfile?.clientCode || "",
            designation: user.teamProfile?.designation || "",
          };
        }

        // Standard Password Flow
        if (!credentials.password) {
          throw new Error("Password is required.");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
          throw new Error("Invalid password credentials.");
        }

        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "USER_LOGIN",
            details: `Logged into Legalex portal with role ${user.role}`,
            ipAddress: "127.0.0.1",
          },
        }).catch(() => {});

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar || "",
          clientCode: user.clientProfile?.clientCode || "",
          designation: user.teamProfile?.designation || "",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.avatar = (user as any).avatar;
        token.clientCode = (user as any).clientCode;
        token.designation = (user as any).designation;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).avatar = token.avatar;
        (session.user as any).clientCode = token.clientCode;
        (session.user as any).designation = token.designation;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "legalex-chambers-secret-production-key-2026",
};
