import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"
import { prisma } from "./lib/prisma";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        MicrosoftEntraID({
            clientId: process.env.AZURE_AD_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
            issuer: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0`,
            authorization: { params: { scope: "openid profile email" } },
        }),
    ],
    session: { strategy: "jwt", maxAge: 60 * 60 },
    trustHost: true,
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async signIn({ profile }) {
            // No email = block early
            if (!profile?.email) return "/unauthorized";

            // Check database user
            const user = await prisma.user.findUnique({
                where: { email: profile.email }
            });

            // ❌ Not in the database → redirect to unauthorized page
            if (!user) {
                return "/unauthorized";
            }

            // Otherwise allow login
            return true;
        },
        
        async jwt({ token, user }) {
            if (user?.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: user.email },
                    include: {
                        role: {
                            include: { permissions: { include: { permission: true } } },
                        },
                    },
                });

                if (user) {
                    token.role = dbUser?.role?.name || "user";
                    token.permissions = dbUser?.role?.permissions.map((p) => p.permission.name) || [];
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role;
                session.user.permissions = token.permissions;
            }
            return session;
        },
    },
})