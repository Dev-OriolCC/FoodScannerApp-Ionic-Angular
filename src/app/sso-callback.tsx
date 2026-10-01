import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useRouter } from "expo-router";
import { colors } from "../theme";

/**
 * Landing route for the OAuth redirect.
 *
 * Clerk's `startSSOFlow` sends the provider back to `foodappignite://sso-callback`,
 * and Expo Router resolves that deep link as a route — without this file the user
 * lands on the "Unmatched Route" page. The browser session itself is what hands the
 * result back to `useSocialAuth`, so nothing is exchanged here: the screen just steps
 * back to the auth screen the flow started from. The root layout swaps in the tabs on
 * its own once Clerk reports a signed-in session.
 */
export default function SSOCallbackScreen() {
    const router = useRouter();

    useEffect(() => {
        if (router.canGoBack()) {
            router.back();
        } else {
            // Cold start: the deep link relaunched the app, so there is no history.
            router.replace("/(auth)/welcome");
        }
    }, [router]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colors.primary[700]} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#FFFFFF",
    },
});
