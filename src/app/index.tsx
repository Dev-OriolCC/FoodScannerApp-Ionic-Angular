import { Redirect } from "expo-router";
import { useAuth } from "@clerk/expo";

export default function Index() {
    const { isLoaded, isSignedIn } = useAuth();

    if (!isLoaded) return null;

    // Clerk restores the session from the token cache, so returning users skip login.
    return <Redirect href={isSignedIn ? "/(tabs)/home" : "/(auth)/welcome"} />;
}
