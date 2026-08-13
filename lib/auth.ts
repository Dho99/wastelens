import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [
        "https://phosphorescently-stretchier-sharyl.ngrok-free.dev",
        "http://localhost:3000",
        "https://wastelens-green.vercel.app",
    ],
    emailAndPassword: {
        enabled: true,
        // Use nama as the user's display name field
        autoSignIn: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    user: {
        additionalFields: {
            saldo_koin: {
                type: "number",
                defaultValue: 0,
            },
            status: {
                type: "string",
                defaultValue: "active",
            },
            role: {
                type: "string",
                defaultValue: "user",
            },
        },
    },
    // Map Better Auth's "name" field to our "nama"
    // Better Auth requires "name" for signUp; we'll pass both
});
