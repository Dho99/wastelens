import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    // Use nama as the user's display name field
    autoSignIn: true,
  },
  user: {
    additionalFields: {
      nama: {
        type: "string",
        required: true,
      },
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
