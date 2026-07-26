import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;

export const googleSignin = async () => {
    await authClient.signIn.social({
        provider: "google",
    });
};
