import NextAuth from "next-auth"
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id"

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [MicrosoftEntraID],
    session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
})