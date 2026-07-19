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
    ],
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
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
});
