import { useState } from "react";
import { Alert } from "react-native";
import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import { alertIfSessionTask } from "../lib/authNavigation";
import { parseClerkError } from "../lib/clerkErrors";

export type SocialStrategy = "oauth_google" | "oauth_facebook";

// Browser-based SSO for the "Continue with ..." buttons. Sign in and sign up
// share the same call: Clerk creates the account if the email is new.
export function useSocialAuth() {
    const { startSSOFlow } = useSSO();
    const [isSocialLoading, setIsSocialLoading] = useState(false);

    const signInWithSocial = async (strategy: SocialStrategy) => {
        setIsSocialLoading(true);
        try {
            // Same URL Clerk builds by default, spelled out so the link to the
            // `sso-callback` route that catches the redirect stays obvious.
            const redirectUrl = AuthSession.makeRedirectUri({ path: "sso-callback" });
            const { createdSessionId, setActive } = await startSSOFlow({ strategy, redirectUrl });

            // No session means the user closed the browser; that is not an error.
            if (createdSessionId && setActive) {
                // Signed-in state flips the root layout over to the tabs (home).
                await setActive({ session: createdSessionId, navigate: alertIfSessionTask });
            }
        } catch (error) {
            Alert.alert("Sign in failed", parseClerkError(error).message);
        } finally {
            setIsSocialLoading(false);
        }
    };

    return { signInWithSocial, isSocialLoading };
}
