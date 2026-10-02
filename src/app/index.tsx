import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ONBOARDING_SEEN_KEY } from "../constants/onboarding";

export default function Index() {
    const { isLoaded, isSignedIn } = useAuth();
    const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);

    useEffect(() => {
        AsyncStorage.getItem(ONBOARDING_SEEN_KEY)
            .then((value) => setHasSeenOnboarding(value === "true"))
            .catch(() => setHasSeenOnboarding(true));
    }, []);

    if (!isLoaded || hasSeenOnboarding === null) return null;

    // Clerk restores the session from the token cache, so returning users skip login.
    if (isSignedIn) return <Redirect href="/(tabs)/home" />;

    // First launch: show the onboarding once before the welcome screen.
    return <Redirect href={hasSeenOnboarding ? "/(auth)/welcome" : "/onboarding"} />;
}
